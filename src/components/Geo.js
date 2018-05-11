import React from 'react';
import * as UI from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import '../style/geo.css';
import '../style/common.css';
import shops from '../data/geodata.js';
import { colors } from '@vkontakte/vkui';
import {connect} from "react-redux";

const mapStateToProps = state => {
    return {
        activePanel: state.activePanel,
    };
};

const ShopItem = props => <UI.ListItem key={props.key} onClick={() => {
    if (!props.placemark.balloon.isOpen()) {
        props.placemark.balloon.open();
        props.map.setCenter(props.center, 15, {
            checkZoomRange: true
        });
        {console.log(props.map.getZoom())}
    } else {
        props.placemark.balloon.close();
    }
    return false;
}}>
    <div className='shop-name-dist'>
        <div className='shop-name'>Перекресток</div>
        <div className='shop-dist'>{props.dist} м</div>
    </div>
    <div className='shop-address'>{props.address}</div>
</UI.ListItem>;

let children = [];

class ConnectedGeo extends React.Component {
    constructor(props) {
        super(props);

        this.isMapLoaded = false;

        let self = this;
        let connect = this.props.data.connect;
        connect.subscribe((e) => {
            let result = e.detail;
            if (result['type'] === 'VKWebAppGeodataResult' && result['data']['available'] === 1) {
                self.lat = result['data']['lat'];
                self.long = result['data']['long'];
                this.renderMap();
            }
        });
        connect.send('VKWebAppGetGeodata');
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.activePanel !== this.props.activePanel) {
            this.props.data.parent.setState({activePanel: this.props.activePanel});
        }
    }

    renderMap() {
        window.ymaps.ready(init);
        let self = this;

        function init() {
            if (self.isMapLoaded) {
                return;
            }

            let myMap = new window.ymaps.Map("map", {
                center: [55.73, 37.75],
                zoom: 10,
                controls: ['geolocationControl']
            }, {
                searchControlProvider: 'yandex#search',
                suppressMapOpenBlock: true
            });

            myMap.controls.add('zoomControl', { top: 75, left: 5 });

            let currentPosition = [self.lat, self.long];
            let placemark = new window.ymaps.Placemark(currentPosition, {
                balloonContentBody: 'Мое местоположение'
            }, {
                preset: 'islands#darkGreenCircleDotIcon'
            });
            myMap.geoObjects.add(placemark);

            let collection = new window.ymaps.GeoObjectCollection(null, { preset: 'islands#darkGreenIcon' });

            myMap.geoObjects.add(collection);

            for (let i = 0, len = shops.length; i < len; i++) {
                shops[i].distance = window.ymaps.coordSystem.geo.getDistance(shops[i].center, currentPosition);
            }
            shops.sort(function(a, b) {
                return a.distance > b.distance;
            });

            for (let i = 0, len = shops.length; i < len; i++) {
                createShop(shops[i], i);
            }

            function createShop(shop, key) {
                let placemark = new window.ymaps.Placemark(shop.center, {
                    balloonContentHeader: shop.balloonContentHeader,
                    balloonContentBody: shop.balloonContentBody,
                    balloonContentFooter: shop.balloonContentFooter
                });
                children.push(<ShopItem key={key} address={shop.balloonContentBody} placemark={placemark}
                                        dist={(shop.distance / 1000).toFixed(1)} map={myMap} center={shop.center}/>);
                collection.add(placemark);
                console.log("and here");
                console.log(shop.distance);
            }
            myMap.setBounds(myMap.geoObjects.getBounds());
            document.getElementById('shop-list').style.display = 'none';
            document.getElementById('shop-list').style.display = 'inline';
            self.forceUpdate();

            self.isMapLoaded = true;
        }
    }

    render() {
        return (
            <div className='container-geo'>
                <UI.Pane className='view-header'>Карта</UI.Pane>
                <div id="map" className='y-map'/>
                <div id='shop-list' className='shop-list' style={{'listStyleType': 'none'}}>
                    <UI.Group>
                        <UI.List>
                            {children}
                            {console.log(children)}
                        </UI.List>
                    </UI.Group>
                </div>
            </div>
        )
    }
}

const Geo = connect(mapStateToProps, null)(ConnectedGeo);

export default Geo;

