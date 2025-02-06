function(instance, properties, context) {
    // Convert the duration (em segundos) para Number
    const duration = Number(properties.duration) ?? 0;

    // Helper function to read a cookie value por nome
    function get_cookie(cookie_name) {
        const value = "; " + document.cookie;
        const parts = value.split("; " + cookie_name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
    }

    // Helper function para remover o cookie
    function delete_cookie(cookie_name) {
        document.cookie = cookie_name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }

    // Verifica se o cookie "timer_started" existe
    const cookie_value = get_cookie("timer_started");
    let start_datetime = null;

    if (cookie_value) {
        // Se existir, converte o valor para um objeto Date
        start_datetime = new Date(cookie_value);
    }

    // Se o timer já foi iniciado (cookie existe), calcule o end_datetime.
    // Caso contrário, o timer não foi iniciado e usaremos a duração completa.
    let end_datetime = null;
    if (start_datetime) {
        end_datetime = new Date(start_datetime.getTime() + duration * 1000);
    }

    // Se já existir um timer em execução, limpa o intervalo anterior
    if (instance.data.timer_interval) {
        clearInterval(instance.data.timer_interval);
    }

    // Limpa o canvas e aplica os estilos para centralização
    instance.canvas.empty();
    instance.canvas.css({
        "display": "flex",
        "justify-content": "center",
        "align-items": "center",
        "overflow": "visible",
        "white-space": "nowrap"
    });

    // Função interna para atualizar o timer a cada segundo
    function update_timer() {
        const now = new Date();
        let diff_sec;

        if (start_datetime) {
            // Se o timer foi iniciado, calcula a diferença
            const diff_ms = end_datetime - now;
            diff_sec = Math.max(0, Math.floor(diff_ms / 1000));
        } else {
            // Caso o timer ainda não tenha sido iniciado
            diff_sec = duration;
        }

        // Converte diff_sec para hh:mm:ss
        const hours = Math.floor(diff_sec / 3600);
        const minutes = Math.floor((diff_sec % 3600) / 60);
        const seconds = diff_sec % 60;
        const display =
            (hours < 10 ? "0" + hours : hours) + ":" +
            (minutes < 10 ? "0" + minutes : minutes) + ":" +
            (seconds < 10 ? "0" + seconds : seconds);

        // Calcula o percentual completo
        const percent_complete = (duration > 0)
            ? Math.round(((duration - diff_sec) / duration) * 100)
            : 0;

        // Atualiza a interface e os estados expostos
        instance.canvas.text(display);
        instance.publishState("seconds_remaining", diff_sec);
        instance.publishState("percent_complete", percent_complete);

        // Se o tempo esgotar, limpa o intervalo, dispara o evento e remove o cookie
        if (diff_sec <= 0) {
            clearInterval(instance.data.timer_interval);
            delete_cookie("timer_started");
            instance.triggerEvent("timer_finished");
        }
    }

    // Inicia a atualização imediata do timer
    update_timer();

    // Se o timer foi iniciado (cookie existe), agenda a atualização a cada segundo
    if (start_datetime) {
        instance.data.timer_interval = setInterval(update_timer, 1000);
    }
}