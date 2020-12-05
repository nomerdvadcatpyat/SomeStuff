/**
 * Возвращает новый emitter
 * @returns {Object}
 */

const events = new Map();

function getEmitter() {

    return {
 
        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         */
        on: function (event, context, handler) {
            checkEventInEventListener(event);
            events.get(event).push({
                context,
                handler,
                count: 0
            });

            return this;
        },
 
        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         */
        off: function (event, context) {
            const keys = events.keys();
            for (let key of keys) {
                let namespaces = getEventNamespaces(key);
                if (namespaces.includes(event)) {
                    let newValue = events.get(key).filter(e => e.context !== context);
                    events.set( key, newValue );
                }
            }

            return this;
        },
 
        /**
         * Уведомить о событии
         * @param {String} event
         */
        emit: function (event) {
            let namespaces = getEventNamespaces(event);

            for(namespace of namespaces) {
                let evNameSpace = events.get(namespace);
                if(!evNameSpace) {
                    evNameSpace = [];
                }
                for(e of evNameSpace) {
                    let times = e.times ? e.times : Infinity;
                    let freq = e.frequency ? e.frequency : 1;
                    if(e.count < times && e.count % freq === 0) {
                        e.handler.call(e.context);
                    }
                    e.count++;
                }
            }

            return this;
        },
 
        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         */
        several: function (event, context, handler, times) {
            checkEventInEventListener(event);
            eventListener.get(event).push({
                context,
                handler,
                times: times,
                count: 0
            });

            return this;
        },
 
        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         */
        through: function (event, context, handler, frequency) {
            checkEventInEventListener(event);
            eventListener.get(event).push({
                context,
                handler,
                frequency: frequency,
                count: 0
            });

            return this;
        }
    };
}

function getEventNamespaces(event) {
    const namespaces = [];
    let i = event.split('.').length;
    while(i > 0) {
        namespaces.push(event.split('.', i).join('.'));
        i--;
    }
    return namespaces;
}

function checkEventInEventListener(event) {
    if (!events.has(event)) {
        events.set(event, []);
    }
}
 
module.exports = {
    getEmitter
};