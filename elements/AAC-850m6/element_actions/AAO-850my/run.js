function(instance, properties, context) {
    console.log('properties' + properties.id);
    console.log('instance' + instance.data.id);
    console.log('cookie name' + instance.data.cookie_name);
    if(properties.id === instance.data.id) {
        const now = new Date();
        document.cookie = `${instance.data.cookie_name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        document.cookie = `${instance.data.cookie_name}=${now.toISOString()}; path=/;`;
        
    }
    instance.data.timer_interval = setInterval(instance.data.update_timer, 333);
}