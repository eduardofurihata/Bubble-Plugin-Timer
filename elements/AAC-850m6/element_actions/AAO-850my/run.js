function(instance, properties, context) {
    instance.data.clearCookie(instance.data.cookie_name);
    instance.data.setCookie(instance.data.cookie_name, new Date());        
    instance.data.timer_interval = setInterval(() => instance.data.publishTimer(instance.data.duration), 333);
}