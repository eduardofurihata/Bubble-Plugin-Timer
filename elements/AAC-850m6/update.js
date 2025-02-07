function(instance, properties, context) {
    instance.data.startCanvas = function(){
        instance.canvas.empty();
        instance.canvas.css({
            "display": "flex",
            "justify-content": "center",
            "align-items": "center",
            "overflow": "visible",
            "white-space": "nowrap",
        });
    }

    instance.data.getCookie = function (cookie_name) {
        const value = "; " + document.cookie;
        const parts = value.split("; " + cookie_name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
    }

    instance.data.getCookieStartTime = function (cookie_name) {
        var cookieStart = instance.data.getCookie(cookie_name);
        return cookieStart ? new Date(cookieStart) : null;
    }

    instance.data.clearCookie = function(name) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }

    instance.data.setCookie = function(name, time) {
        document.cookie = `${name}=${time.toISOString()}; path=/;`;
    }

    instance.data.computeEndTime = function(startTime, duration) {
        return startTime ? new Date(startTime.getTime() + duration * 1000) : null;
    }
    
    instance.data.computeRemainingSeconds = function(endTime){
        var now = new Date();
        var diff_ms = endTime - now;
        return Math.max(0, Math.floor(diff_ms / 1000));
    }   

    instance.data.getTimer = function(startTime, duration) {
        var now = new Date();
        var endTime = instance.data.computeEndTime(startTime, duration);
        var remainingSeconds = endTime ? instance.data.computeRemainingSeconds(endTime) : duration;
        var hrs = Math.floor(remainingSeconds / 3600);
        var mins = Math.floor((remainingSeconds % 3600) / 60);
        var secs = remainingSeconds % 60;
        var display =
            (hrs < 10 ? "0" + hrs : hrs) + ":" +
            (mins < 10 ? "0" + mins : mins) + ":" +
            (secs < 10 ? "0" + secs : secs);
        var percent_complete = (duration > 0)
        ? Math.round(((duration - remainingSeconds) / duration) * 100)
        : 0;
        return {remainingSeconds: remainingSeconds, percent_complete: percent_complete, display: display};
    }
    
    instance.data.publishTimer = function (duration) {
        var startTime = instance.data.getCookieStartTime(instance.data.cookie_name);
        var timer = instance.data.getTimer(startTime, duration);
        instance.canvas.text(timer['display']);
        instance.publishState("seconds_remaining", timer['remainingSeconds']);
        instance.publishState("percent_complete", timer['percent_complete']);
        if (timer['remainingSeconds'] <= 0) {
            clearInterval(instance.data.timer_interval);
            instance.triggerEvent("timer_finished");
        }
        instance.triggerEvent("timer_updated");
    }

    instance.data.startCanvas();
    clearInterval(instance.data.timer_interval);
    instance.data.cookie_name = `bubble_timer_${properties.id}`;
    instance.data.id = properties.id;
    instance.data.duration = Number(properties.duration);
    
    var start_datetime = instance.data.getCookieStartTime(instance.data.cookie_name);
    if(start_datetime && start_datetime.getTime() !== 0)
        instance.data.timer_interval = setInterval(() => instance.data.publishTimer(instance.data.duration), 333);
    instance.data.publishTimer(instance.data.duration);
    console.log(instance.data.getCookie(instance.data.cookie_name));
}