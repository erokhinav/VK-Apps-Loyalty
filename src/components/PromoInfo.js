import React from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import { colors } from '@vkontakte/vkui';
import '../style/promoinfo.css';
import {connect} from "react-redux";

const mapStateToProps = state => {
    return {
        activePanel: state.activePanel,
    };
};

class ConnectedPromoInfo extends React.Component {

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.activePanel !== this.props.activePanel) {
            this.props.data.parent.setState({activePanel: this.props.activePanel});
        }
    }

    componentDidMount() {
        if (navigator.userAgent.match(/Android/)) {
            let image = document.getElementById('promo-image');
            let discount = document.getElementById('discount-promo-info');
            image.style.width = image.style.height = window.getComputedStyle(discount, null).getPropertyValue("width");
        }
    }

    render() {
        let parent = this.props.data.parent;
        let itemData = parent.state.promoData;

        return (
            <div className='list-container-promo-info'>
                <div className='promo'>
                    <img id='promo-image' className='promo-image' src={itemData.imageUrl} />
                    <div className='discount-promo-container'>
                        <div id='discount-promo-info' className='discount-promo-info'>
                            <div className='discount-promo-info-text'>{itemData.value}</div>
                        </div>
                    </div>
                    <div className='promo-title'>
                        {itemData.title}
                    </div>

                    {itemData.until ?
                        <div className='promo-until'>
                            До {itemData.until}
                        </div> : null}

                    <hr className='horizontal-line'/>
                    <div className='promo-description'>
                        {itemData.description}
                    </div>
                </div>
            </div>
        )
    }
}

const PromoInfo = connect(mapStateToProps, null)(ConnectedPromoInfo);

export default PromoInfo;

