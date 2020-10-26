cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        this.node.on('_state_change', this.handleChange, this);
    },

    onDestroy() {
        this.node.off('_state_change', this.handleChange, this);
    },

    handleChange(evt) {
        /**
         * @var Object
         */
        const data = evt.getUserData();
        let update = false;
        if (data.hasOwnProperty('heart')) {
            update = true;
        }
        if (data.hasOwnProperty('money')) {
            update = true;
        }

        if (update) {
            const localStorage = cc.sys.localStorage;
            let state = JSON.parse(localStorage.getItem('userState'));
            
            if (data.hasOwnProperty('heart')) {
                state.heart += parseInt(data.heart);
            }
            if (data.hasOwnProperty('money')) {
                state.money += parseInt(data.money);
            }

            localStorage.setItem('userState', JSON.stringify(state));
        }
    },
});
