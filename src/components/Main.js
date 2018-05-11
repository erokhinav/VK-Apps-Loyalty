import React from 'react';
import * as UI from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import '../style/main.css';
import '../style/common.css';
import History from './History.js';
import { connect } from "react-redux";
import { viewForward } from "../redux/actions/index";

import IconPlace24 from '@vkontakte/vkui/dist/icons/24/place';
import IconMoneyTransfer24 from '@vkontakte/vkui/dist/icons/24/money_transfer';
import IconHelp24 from '@vkontakte/vkui/dist/icons/24/help';
import IconLike24 from '@vkontakte/vkui/dist/icons/24/like';
import { colors } from '@vkontakte/vkui';

const mapStateToProps = state => {
    return {
        activePanel: state.activePanel,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        viewForward: views => dispatch(viewForward(views)),
    };
};

class ConnectedMain extends React.Component {
    constructor(props) {
        super(props);

        let itemsSize = props.promo.length;
        for (let index = 0; index < itemsSize; index++) {
            props.promo[index]['key'] = index;
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.activePanel !== this.props.activePanel) {
            this.props.data.parent.setState({activePanel: this.props.activePanel});
        }
    }

    viewForward(panelName) {
        this.props.viewForward({newView: panelName, oldView: 'Main'});
        this.props.data.connect.send('VKWebAppViewUpdateNavigationState', {canBack: true, canForward: false});
    }

    render() {
        let data = this.props.data;
        let parent = data.parent;
        let promo = this.props.promo;
        let history = this.props.history;
        let self = this;

        return (
                <div className='main-container'>
                    <UI.Pane className='main-header'>
                        <div className='main-header-container'>
                            <IconHelp24 className='icon-help' fill={colors.backgroundBlue}
                                        onClick={ () => { self.viewForward('Help')} }/>
                            <div className='center'>
                                <div className='overall-points-header font'>
                                    ВСЕГО БАЛЛОВ
                                </div>
                                <div className='points-header'>
                                    {data.pointsOverall}
                                </div>
                                <div className='discount-header font'>
                                    Ваша скидка: {data.discount} ₽
                                </div>
                            </div>
                            <IconPlace24 className='icon-place' fill={colors.backgroundBlue}
                                onClick={ () => { self.viewForward('Geo')} }/>
                        </div>
                    </UI.Pane>

                    <div className='bottomHeaderWrapper'>
                        <UI.Pane>
                            <div className='container'>

                                <div className='points-button center-inner' onClick={ () => { self.viewForward('Points')} } >
                                    <IconLike24 className='bottom-header-icon' fill={colors.headerBlue}/>
                                    <div className='bottom-header-text'>
                                        БАЛЛЫ
                                    </div>
                                </div>

                                <div className='card-button center-inner' onClick={ () => { self.viewForward('Card')} }>
                                    <IconMoneyTransfer24 className='bottom-header-icon' fill={colors.headerBlue}/>
                                    <div className='bottom-header-text'>
                                        КАРТА
                                    </div>
                                </div>

                                <div style={{margin: 'auto'}}>
                                    <div className='vertical-line'/>
                                </div>


                            </div>
                        </UI.Pane>
                    </div>

                    <UI.Group>
                        <UI.Header className='promo-group' level='2' aside={
                            <span className='all-items'
                                style={{ color: colors.accentBlue }}
                                onClick={ () => { self.viewForward('Promo')} }>
                                Все акции
                            </span>
                        }>
                            <div className='promo-title-main font'>
                                Акции
                            </div>
                            <div className='promo-count font'>
                                {promo.length}
                            </div>
                        </UI.Header>
                        <UI.Gallery
                            slideWidth='140px'
                            style={{ height: 157 }}
                            className='promo-group'
                        >
                            {
                                promo.map(function(itemData) {
                                    return (
                                        <div key={itemData.key}
                                             style={{ height: 157}} onClick={ () => {parent.setState({
                                            promoData: itemData, backViewPromoInfo: 'Main'});
                                            self.viewForward('PromoInfo');
                                             } }>
                                            <div className='image-container'>
                                                <img className='image' src={itemData.imageUrl} height='125' width='125'/>
                                                <div className='discount'><div className='discount-text'>{itemData.value}</div></div>
                                                <div className='promo-item-title'>{itemData.title}</div>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </UI.Gallery>
                    </UI.Group>

                    <UI.Group>
                        <UI.Header className='history-group' level='2' aside={
                            <span
                                style={{ color: colors.accentBlue }}
                                onClick={ () => { self.viewForward('History')} }>
                                Показать все
                            </span>
                        }>
                            <div className='history-title font'>
                                ИСТОРИЯ
                            </div>
                        </UI.Header>
                        <History show={5} items={history} data={data} main backPanel='Main'/>
                    </UI.Group>
                </div>
        );
    }
}

const Main = connect(mapStateToProps, mapDispatchToProps)(ConnectedMain);

export default Main;