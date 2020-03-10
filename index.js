$(function () {

    // 对象存储所有天气数据
    var weather = {};

    var url = "https://api.heweather.net/s6/";

    var weatherType = "weather/now";

    var obj = {
        location: "auto_ip",
        key: '2cbc4c88d2034603b42cb8f8aa15a519'
    }

    // 地址对象
    var location = {}

    function getLocation() {
        return $.ajax({

            type: 'get',
            data: {
                key: 'TJXBZ-CMXEP-Z5ADB-VAQOZ-QRWZ3-LZF5Y',
                output: 'jsonp'
            },
            url: 'https://apis.map.qq.com/ws/location/v1/ip',
            dataType: 'jsonp',
            jsonp: 'callback',
        })

    }


    function a(weatherType) {
        return $.ajax({
            type: "get",
            url: url + weatherType,
            data: obj,
        })
    }

    var pro = getLocation()
    var promise1 = pro.then(function (data) {
        obj.location = data.result.location.lng + ',' + data.result.location.lat;
        return a(weatherType)
    })
    // /*  var promise1 = a(weatherType)

    var promise2 = promise1.then(function (data) {
        weather[weatherType] = data
        weatherType = "weather/forecast"
        return a(weatherType)
    })
    var promise3 = promise2.then(function (data) {
        weather[weatherType] = data
        weatherType = "weather/hourly"
        return a(weatherType)
    })
    var promise4 = promise3.then(function (data) {
        weather[weatherType] = data
        weatherType = "weather/lifestyle"
        return a(weatherType)
    })
    var promise5 = promise4.then(function (data) {
        weather[weatherType] = data;
        weatherType = "air/now";
        return a(weatherType)
    })
    var promise6 = promise5.then(function (data) {
        weather[weatherType] = data;
        weatherType = "weather/historical"
        var time = new Date().getTime() - 60 * 60 * 24 * 1000;
        var yes = new Date(time);

        function zero(tar) {
            return tar = (tar < 10) ? ("0" + tar) : tar
        }
        yesterday = yes.getFullYear() + "-" + zero(yes.getMonth() + 1) + '-' + zero(yes.getDate())
        var hisobj = {
            location: data.HeWeather6[0].basic.cid,
            date: yesterday,
            key: '2cbc4c88d2034603b42cb8f8aa15a519'
        }

        return $.ajax({
            type: "get",
            url: url + weatherType,
            data: hisobj,
        })
    })
    var promise7 = promise6.done(function (data) {
        weather[weatherType] = data
        console.log(weather)
        changeBackGround()
        myPlace()

    })

    // 获取天气盒子
    var weatherBox = $('.weather-box');

    // 禁止中文字
    document.addEventListener("selectstart", function (e) {
        e.preventDefault();
    })


    // 清除背景
    function removeBg() {
        weatherBox.removeClass("sun").removeClass("rain").removeClass("night");
    }

    // 根据时间和天气更换背景
    function changeBackGround() {
        let date = new Date()
        let hour = date.getHours()
        removeBg()
        if ((hour >= 18 && hour <= 24) || (hour >= 0 && hour < 6)) {
            weatherBox.addClass('night')
        } else {
            let wn = "weather/now"
            let nowData = weather[wn].HeWeather6[0]
            let typeCode = nowData.cond_code;
            // 如果天气为晴天清风 则用sun背景
            if (typeCode === 100 || typeCode === 201 || typeCode === 202 || typeCode === 203 || typeCode === 204) {
                weatherBox.addClass('sun')
            } else {
                weatherBox.addClass('rain')
            }
        }

    }

    // 更改天气信息
    function myPlace() {

        // 获取各个天气的对象
        let wn = "weather/now"
        let nowData = weather[wn].HeWeather6[0]
        let an = "air/now"
        let airData = weather[an].HeWeather6[0]
        let wf = "weather/forecast"
        let forecastData = weather[wf].HeWeather6[0]
        let wh = "weather/historical"
        let historyData = weather[wh].HeWeather6[0]
        let whour = "weather/hourly"
        let hourData = weather[whour].HeWeather6[0]
        let wl = "weather/lifestyle"
        let lifeData = weather[wl].HeWeather6[0]

        //my-place信息

        // 城市名称
        $('.city-name').text(nowData.basic.location);
        $('.temperature').text(nowData.now.tmp);
        // 天气类型
        $('.kind').text(nowData.now.cond_txt)
        // 更新时间
        $('.time').text(nowData.update.loc.split(" ")[1])
        // 最大最小温度
        $('.max').text(forecastData.daily_forecast[1].tmp_max)
        $('.min').text(forecastData.daily_forecast[1].tmp_min)
        // 空气质量
        $('.air>span').text(airData.air_now_city.qlty);

        var date = new Date()
        var hour = date.getHours()

        //hours-weather信息

        var count = 24;
        // 要设置的内容
        var hour = null;
        var imgName = null;
        var tem = null;
        // 遍历生成
        for (let j = 0; j < count; j++) {
            hour = hourData.hourly[j].time.split(" ")[1];
            imgName = hourData.hourly[j].cond_code
            tem = hourData.hourly[j].tmp
            let li = $(`<li class="hours-w opacity2">
            <div class="hour">${hour}</div>
            <div class="hour-icon"><img src="icon-weather/${imgName}.png"></div>
            <div class="hour-tem">${tem}&deg;C</div>
        </li>`)
            $('.hours-box>ul').append(li)
        }

        //days-weather信息

        //年月日格式转换
        function change(t) {
            return t.split("-")[1] + "月" + t.split("-")[2] + "日"
        }
        var weekArr = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
        // 返回周几
        function week(date) {
            return weekArr[new Date(date).getDay()]
        }


        // 未来七天天气
        var forecast = forecastData.daily_forecast
        //生成days-w
        var num = 7;
        //需要设置的参数
        var weekday = null;
        var temMax = null;
        var temMin = null;
        var name = null;
        var monthDay = null;
        // 循环生成七日预报
        for (var i = 0; i < num; i++) {

            // 设置周几
            if (i === 0) {
                weekday = "昨天"

            } else if (i === 1) {
                weekday = "今天";
            } else if (i === 2) {
                weekday = "明天";
            } else {
                weekday = week(forecast[i].date)
            }

            // 设置日月
            monthDay = change(forecast[i].date)
            // 最大最小温度
            temMax = forecast[i].tmp_max
            temMin = forecast[i].tmp_min

            // 白天和夜晚图像

            if ((hour >= 18 && hour <= 24) || (hour >= 0 && hour < 6)) {
                name = forecast[i].cond_code_n
            } else {
                name = forecast[i].cond_code_d
            }

            // 生成days-w盒子
            var html = $(`<div class="days-w">
                <div class="day">${monthDay}${weekday}</div>
                <div class="day-w"><img src="icon-weather/${name}.png" alt=""></div>
                <div class="day-max-min">
                    <span class="day-max">${temMax}&deg;C</span> / <span class="day-min">${temMin}&deg;C</span>
                </div>
            </div>`)

            $('.view').before(html)
            if (i === 0) {
                html.addClass('opacity')
            }
        }


    }

})