function(instance, properties, context) {
    instance.data.clearCookie(instance.data.cookie_name);
    clearInterval(instance.data.timer_interval);
    instance.data.publishTimer(instance.data.duration);
}