function(instance, properties, context) {
    // Recupera os novos valores dos inputs
    var duration = Number(properties.duration);
    var start_datetime = new Date(properties.start_datetime);

    // Limpa qualquer timer já em execução
    if (instance.data.timer_interval) {
        clearInterval(instance.data.timer_interval);
    }
    instance.canvas.empty();

    // Aplica os estilos para centralizar o conteúdo
    instance.canvas.css({
        "display": "flex",
        "justify-content": "center",
        "align-items": "center",
        "overflow": "visible",
        "white-space": "nowrap",
    });

    // Recalcula end_datetime com base nos novos valores
    instance.data.end_datetime = new Date(start_datetime.getTime() + duration * 1000);
    instance.data.duration = duration;

    // Função interna para atualizar o timer
    function update_timer() {
        var now = new Date();
        var diff_ms = instance.data.end_datetime - now;
        var diff_sec = start_datetime.getTime() === 0 ? duration : Math.max(0, Math.floor(diff_ms / 1000));
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
    }

    // Inicia a atualização imediata e agenda para a cada segundo
    update_timer();
    if (start_datetime.getTime() !== 0)
        instance.data.timer_interval = setInterval(update_timer, 1000);
}