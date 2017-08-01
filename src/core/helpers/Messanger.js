export default class Messanger {

    constructor(listener) {
        if (!listener) throw new Error('listener empty');
        this.listener = listener;
    }

    connect(initSuccess) {
        if (this.websocket) throw new Error('Websocket already exists');

        let reconnect = () => {
            this.websocket = new WebSocket(`${config.WS_URL}/messageHandler`);
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
      if (!this.websocket) throw new Error('Websocket not initialize');
      this.websocket.close();
    }

    getMessages(userId, offset, limit) {
        this._send({command: 'getMessages', userId: userId, offset: offset, limit: limit});
    }

    sendMessage(message) {
      this._send({
        command: 'addMessage',
        message: message
      });
    }

    makeRead(tutorId) {
        this._send({
            command: 'makeRead',
            userId: tutorId
        });
    }

    _send(message) {
      this.websocket.send(JSON.stringify(message));
    }
}
