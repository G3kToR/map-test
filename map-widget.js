Vue.component('map-widget', {
    template: `
        <div class="mw-wrapper" :style="getSize">
            <div class="mw-desk" v-if="markDesk.show" >
                <svg class="mw-exit-ico"
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

    props: {

        name: {
            required: true,
        },

        size: {
            default: () => [480, 320],
        },

        placemarks: {
            default: () => []
        },

    },

    data() {
        return {
            markDesk: {show: false, data: null},
            myMap: null,
            /*name: 'map',
            size: [400, 400],
            placemarks: [
                {
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
                    coords: ["55.728373", "39.669054"],
                    desk: {
                        name: 'Тест название2',
                        address: 'г. Москва, ул. Московская, д.248',
                        text: 'Текстовое описание2',
                        phone: '8 900 555 35 36',
                        site: 'www.test2.ru'
                    },
                }
            ],*/
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
                'width': ((this.size[0] < 480) ? 480 : this.size[0]) + 'px',
                'height': ((this.size[1] < 320) ? 320 : this.size[1]) + 'px'
            };
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
    },
})


/*const MapWidget = new Vue({
    el: '.map-widget',
    template: `<map-widget name="name1" :placemarks="placemarks"></map-widget>`,
    data() {
        return {
            name: 'map',
            size: [400, 400],
            placemarks: [
                {
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
    }
});*/
/*const MW = new Vue({
    template: `<map-widget :name="name" :size="size" :placemarks="placemarks"></map-widget>`,
    data() {
    return {
        name: 'map',
        size: [400, 400],
        placemarks: [
            {
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
}
})//.$mount('.map-widget');*/

$(document).ready(function () {
    let maps = document.getElementsByClassName('map-widget');
    let test = [];
    for (let i = 0; i != maps.length; i++) {
        console.log(maps[i].dataset.placemarks);
        test.push(new Vue({
            //el: '#' + maps[i].id,
            template: `<div><map-widget :name="name" :size="size" :placemarks="placemarks"></map-widget><slot></slot></div>`,
            data: {
                name: maps[i].id,
                size: [
                    (maps[i].dataset.width) ? Number(maps[i].dataset.width) : 480,
                    (maps[i].dataset.height) ? Number(maps[i].dataset.height) : 320,
                ],
                placemarks: (maps[i].dataset.placemarks) ? JSON.parse(maps[i].dataset.placemarks) : [],
            }
        }));
    }

    test.forEach((item, index) => {
        console.log(item.name);
        item.$mount('#' + item.name);
    });

});