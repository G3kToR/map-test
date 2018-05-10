const MapWidget = new Vue({
    el: '.map-widget',
    template: `
    <div class="wrapper" :style="getSize">
        <div class="desk" v-if="markDesk.show" >
            <svg class="exit-ico"
                 @click="hideDesk"
                 xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                <path d="M0 0h24v24H0z" fill="none"/>
            </svg>
            <p><span>Название:</span> {{ markDesk.data.name }}</p>
            <p><span>Адрес:</span> {{ markDesk.data.address }}</p>
            <p><span>Описание:</span> {{ markDesk.data.text }}</p>
            <p><span>Телефон:</span> {{ markDesk.data.phone }}</p>
            <p><span>Сайт:</span> {{ markDesk.data.site }}</p>
        </div>
        <div :id="name" :style="getSize"></div>
    </div>
    `,
    data() {
        return {
            markDesk: { show: false, data: null },
            myMap: null,
            name: 'map',
            size: [400, 400],
            placemarks: [
                {
                    markerId: 1,
                    coords: ["55.768715", "37.510193"],
                    desk: {
                        name: 'Тест название1',
                        address: 'г. Москва, ул. Московская, д.8',
                        text: 'Текстовое описание',
                        phone: '8 900 555 35 35',
                        site: 'www.test.ru'
                    },
                },
                {
                    markerId: 2,
                    coords: ["55.728373", "39.669054"],
                    desk: {
                        name: 'Тест название2',
                        address: 'г. Москва, ул. Московская, д.248',
                        text: 'Текстовое описание2',
                        phone: '8 900 555 35 36',
                        site: 'www.test2.ru'
                    },
                }
            ],
        }
    },

    methods: {

        showDesk(index) {
            this.markDesk.data = this.placemarks[index].desk;
            this.markDesk.show = true;
        },

        hideDesk() {
            this.markDesk.data = null;
            this.markDesk.show = false;
        }

    },

    computed: {

        getSize() {
            return {
                'width': ((this.size[0] < 480) ? 480 : this.size[0])+'px',
                'height': ((this.size[1] < 320) ? 320 : this.size[1])+'px'};
        }

    },
    mounted() {
        $.getScript('//api-maps.yandex.ru/2.1/?lang=ru_RU').then(() => {
            const maps = ymaps;
            maps.ready(() => {
                let myCollection = new maps.GeoObjectCollection();

                this.myMap = new maps.Map(this.name, {
                    center: [50, 50],
                    zoom: 8,
                    controls: [],
                });

                if (this.placemarks.length > 0) {
                    for (let i = 0; i < this.placemarks.length; i++) {
                        let myPlacemark = new maps.Placemark([
                            this.placemarks[i].coords[0], this.placemarks[i].coords[1]
                        ]);
                        myPlacemark.events.add('click', function () {
                            this.showDesk(i);
                        }.bind(this));
                        myCollection.add(myPlacemark);
                    }
                    this.myMap.geoObjects.add(myCollection);
                    this.myMap.setBounds(myCollection.getBounds());
                }

            });
        });
    },

    updated() {
        this.myMap.container.fitToViewport();
    }
});