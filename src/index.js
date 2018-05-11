import React from 'react';
import ReactDOM from 'react-dom';
import * as UI from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import Main from './components/Main.js';
import History from './components/History.js';
import Promo from './components/Promo.js';
import Icon28Chevron_back from '@vkontakte/vkui/dist/icons/28/chevron_back';
import Points from './components/Points';
import ItemInfo from './components/ItemInfo';
import PromoInfo from './components/PromoInfo';
import Card from './components/Card';
import Help from './components/Help';
import Geo from './components/Geo';
import { Provider } from "react-redux";
import store from "./redux/store";
import history from "./data/history";
import promo from "./data/promo";
import {goForward, viewForward, goBack} from "./redux/actions";
import {connect} from "react-redux";

const mapStateToProps = state => {
    return {
        activePanel: state.activePanel,
        panelBack: state.panelBack,
        panelForward: state.panelForward,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        viewForward: views => dispatch(viewForward(views)),
        goForward: view => dispatch(goForward(view)),
        goBack: view => dispatch(goBack(view)),
    };
};

class ConnectedApp extends React.Component {

    constructor(props) {
        super(props);
        this.props.data.parent = this;
        this.state = {
            activePanel: 'Main',
            itemData: null,
            promoData: null,
            popout: null,
            backViewItemInfo: 'Main',
            backViewPromoInfo: 'Main',
        };

        this.props.data.connect.subscribe(this.navigationListener.bind(this));
    }

    backButton () {
        let BackIcon = Icon28Chevron_back;

        return (
            <UI.HeaderButton onClick={() => this.setState({ activePanel: 'Main' })}>
                <BackIcon fill='#fff' />
            </UI.HeaderButton>
        );
    }

    navigationListener(e) {
        let connect = this.props.data.connect;
        e = e.detail;
        if (e['type'] === 'VKWebAppGoBack') {
            this.props.goBack(this.props.data.parent.state.activePanel);
            let canBack = false;
            if (this.props.panelBack.length > 0) {
                canBack = true;
            }
            connect.send('VKWebAppViewUpdateNavigationState', {canBack: canBack, canForward: true});

        } else if (e['type'] === 'VKWebAppGoForward') {
            this.props.goForward(this.props.data.parent.state.activePanel);
            let canForward = false;
            if (this.props.panelForward.length > 0) {
                canForward = true;
            }
            connect.send('VKWebAppViewUpdateNavigationState', {canBack: true, canForward: canForward});
        }
    }

    render() {
        let self = this;

        return (
            <UI.View popout={self.state.popout} activePanel={self.state.activePanel}>
                <UI.ScrollView id='Main'>
                    <Main promo={self.props.promo} data={self.props.data} history={self.props.history}/>
                </UI.ScrollView>
                <UI.ScrollView id='Promo'>
                    <Promo items={self.props.promo} data={this.props.data} cart={self.props.cart}/>
                </UI.ScrollView>
                <UI.ScrollView id='History'>
                    <History items={self.props.history} data={self.props.data} header/>
                </UI.ScrollView>
                <UI.ScrollView id='Points'>
                    <Points id='Points' data={self.props.data}/>
                </UI.ScrollView>
                <UI.ScrollView id='Card'>
                    <Card data={self.props.data}/>
                </UI.ScrollView>
                <UI.ScrollView id='ItemInfo'>
                    <ItemInfo itemData={self.state.itemData} cart={self.props.cart} data={self.props.data}/>
                </UI.ScrollView>
                <UI.ScrollView id='PromoInfo'>
                    <PromoInfo promoData={self.state.promoData} data={self.props.data}/>
                </UI.ScrollView>
                <UI.ScrollView id='Help'>
                    <Help data={self.props.data}/>
                </UI.ScrollView>
                <UI.ScrollView id='Geo'>
                    <Geo data={this.props.data}/>
                </UI.ScrollView>
            </UI.View>
        );
    }
}

const App = connect(mapStateToProps, mapDispatchToProps)(ConnectedApp);

let cart = [];

const vkconnect = require('@vkontakte/vkui-connect');
vkconnect.send('VKWebAppInit');

vkconnect.subscribe((e) => {
    e = e.detail;
    if (e['type'] === 'VKWebAppAccessTokenReceived') {
        let access_token = e['data']['access_token'];
        console.log('token: ' + access_token);
    }
});
vkconnect.send('VKWebAppGetAuthToken', {"app_id": 6396978, "scope": "video"});

let data = {
    score: 108,

    pointsOverall: 1445,

    discount: 144,

    currency: '₽',

    leftToUpdateDiscount: 500,

    connect: vkconnect
};

ReactDOM.render(
    <Provider store={store}>
        <App data={data} promo={promo} history={history} cart={cart}/>
    </Provider>,
    document.getElementById('root')
);