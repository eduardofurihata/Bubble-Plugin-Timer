function(instance, properties, context) {
    function get_cookie(cookie_name) {
        const value = "; " + document.cookie;
        const parts = value.split("; " + cookie_name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
    }

    instance.canvas.empty();
    instance.canvas.css({
        "display": "flex",
        "justify-content": "center",
        "align-items": "center",
        "overflow": "visible",
        "white-space": "nowrap",
    });
    if (instance.data.timer_interval) clearInterval(instance.data.timer_interval);
    instance.data.cookie_name = `bubble_timer_${properties.id}`;
    instance.data.id = properties.id;
    instance.publishState('id', properties.id);
    var duration = Number(properties.duration) ?? 0;

    // Função interna para atualizar o timer
    instance.data.update_timer = function () {
        //console.log("update_timer");
        const cookie_value = get_cookie(instance.data.cookie_name);
        var start_datetime = cookie_value ? new Date(cookie_value) : null;
        var now = new Date();
        var end_datetime = start_datetime ? new Date(start_datetime.getTime() + duration * 1000) : null;
        var diff_ms = end_datetime ? end_datetime - now : duration * 1000;
        //console.log("end_datetime", end_datetime);
        var diff_sec = Math.max(0, Math.floor(diff_ms / 1000));
        var hrs = Math.floor(diff_sec / 3600);
        var mins = Math.floor((diff_sec % 3600) / 60);
        var secs = diff_sec % 60;
        var display =
            (hrs < 10 ? "0" + hrs : hrs) + ":" +
            (mins < 10 ? "0" + mins : mins) + ":" +
            (secs < 10 ? "0" + secs : secs);
        var percent_complete = (duration > 0)
            ? Math.round(((duration - diff_sec) / duration) * 100)
            : 0;

        instance.canvas.text(display);
        instance.publishState("seconds_remaining", diff_sec);
        instance.publishState("percent_complete", percent_complete);
        if (diff_sec <= 0) {
            clearInterval(instance.data.timer_interval);
            instance.triggerEvent("timer_finished");
        }
        instance.triggerEvent("timer_updated");
    }

    // Inicia a atualização imediata e agenda para a cada segundo
    instance.data.update_timer();
}