// Vue js instance
var app = new Vue({
    el: '#app',
    data: {
        stopovers: {},
        newStopoverTitle: '',
        newStopoverDescription: ''
    },
    methods: {
        createStopover: function() {
            console.log("C'est parti mon kiki !");
            console.log(this.newStopoverTitle + " " + this.newStopoverDescription)
            this.$http.post(
                'stopover/new', 
                {title: this.newStopoverTitle, description: this.newStopoverDescription}
            )
                .then(
                    function (response) {
                        this.stopovers = JSON.parse(response.bodyText)
                    }
                );
        },
        deleteStopover: function(el) {
            var id = el.target.attributes[0].value

            this.$http.post(
                'stopover/delete', 
                {id: id}
            )
                .then(
                    function (response) {
                        console.log("Fait");
                        this.stopovers = JSON.parse(response.bodyText)
                        this.newStopoverTitle = ''
                        this.newStopoverDescription = ''
                    }
                );
        }
    },
    created: function () {
        this.$http.get('stopover/list').then(response => {
            this.stopovers = response.body
            console.log(response.body)
        })  
    }
});
