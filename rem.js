function rem() {
    // 以iphone6为准，html字体大小为100px
    let baseScreen = 375;
    let baseSize = 100;

    // 获取屏幕大小
    let screenWidth = screen.width;
    // 按比例设置字体大小 令在iphone6中 1rem = 100px
    let fontSize = 0;
    if (screenWidth >= 1200) {
        fontSize = 200;
    } else {
        fontSize = screenWidth / baseScreen * baseSize;
    }

    //获取html对象
    let html = document.documentElement;
    html.style.fontSize = fontSize + 'px';
}

window.onload = function () {
    rem();
    // 空数组存放延时器
    let timers = [];

    window.onresize = function () {

        var timer = setTimeout(function () {

            for (let i = 1; i < timers.length; i++) {
                clearTimeout(timers[i]);
            }

            timers = [];

            rem();

        }, 500)

        timers.push(timer);

    }
}