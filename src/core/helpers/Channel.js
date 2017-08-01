export default class Channel {

    constructor(listener) {
        if ( !listener ) throw new Error('listener empty');
        this.listener = listener;
    }

    connect(initSuccess) {
        if (this.websocket) throw new Error('Websocket already exists');

        let reconnect = () => {
            this.websocket = new WebSocket(`${config.WS_URL}/channelHandler`);
            this.websocket.onopen = () => {
                initSuccess();
            };
            this.websocket.onmessage = (e) => {
                let messages = JSON.parse(e.data);
                this.listener(messages);
            };
        };

        reconnect();
        this.websocket.onerror = (event) => {
            console.error('Websocket error', event);
            reconnect();
        };
    }

    close() {
        this.websocket && this.websocket.close();
    }

    getMessages(userId, offset, limit) {
        this._send({ command: 'getMessages', withUser: userId, offset: offset, limit: limit });
    }

    subscribe(name) {
        this._send({
            command: 'subscribe',
            withUser: name
        });
    }

    sendMessage(message) {
        this._send({
            command: 'addMessage',
            message: message
        });
    }

    _send(message) {
        this.websocket.send(JSON.stringify(message));
    }
}
