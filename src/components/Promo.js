import React from 'react';
import * as UI from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import { colors } from '@vkontakte/vkui';
import '../style/promo.css';
import {viewForward} from "../redux/actions";
import {connect} from "react-redux";

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

class ConnectedPromo extends React.Component {

    constructor(props) {
        super(props);

        let itemsSize = props.items.length;
        for (let index = 0; index < itemsSize; index++) {
            props.items[index]['key'] = index;
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.activePanel !== this.props.activePanel) {
            this.props.data.parent.setState({activePanel: this.props.activePanel});
        }
    }

    render() {
        let parent = this.props.data.parent;
        let items = this.props.items;
        let connect = this.props.data.connect;
        let self = this;

        return (
            <div id='list-container-promo' className='list-container-promo'>
                <UI.List>
                    <div className='items-container'>
                        {
                            items.map(function(itemData) {
                                return (
                                    <div key={itemData.key} className='item-wrap'>
                                        <div key={itemData.key} className='pane-element'>
                                            <div className="promo-item-container" onClick={ () => {
                                                parent.setState({promoData: itemData}, () => {
                                                    console.log('here');
                                                    self.props.viewForward({newView: 'PromoInfo', oldView: 'Promo'});
                                                    connect.send('VKWebAppViewUpdateNavigationState', {canBack: true, canForward: false});
                                                });
                                            } }>
                                                <PromoItem data={itemData}/>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </UI.List>
            </div>
        );
    }
}

class PromoItem extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if ((navigator.userAgent.match(/iPhone/)) || (navigator.userAgent.match(/iPod/))) {
            var photo = document.getElementById('promo-item-photo' + this.props.data.key);
            var discount = document.getElementById('discount-promo' + this.props.data.key);
            photo.style.width = window.getComputedStyle(discount, null).getPropertyValue("width");
        }
    }

    render() {
        let data = this.props.data;

        return (
            <div className='promo-item'>
                <div className='promo-item-photo'>
                    <img id={'promo-item-photo' + data.key} className='promo-item-photo image' src={data.imageUrl}/>
                    <div id={'discount-promo' + data.key} className='discount-promo'><div className='discount-promo-text'>{data.value}</div></div>
                </div>
                <div className='promo-item-name-and-description'>
                    <div className='promo-item-name'>
                        {data.title}
                    </div>
                </div>
            </div>
        )
    }
}

const Promo = connect(mapStateToProps, mapDispatchToProps)(ConnectedPromo);

export default Promo;

