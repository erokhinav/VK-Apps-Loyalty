import React from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import { colors } from '@vkontakte/vkui';
import '../style/iteminfo.css';
import {connect} from "react-redux";

const mapStateToProps = state => {
    return {
        activePanel: state.activePanel,
    };
};

class ConnectedItemInfo extends React.Component {

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.activePanel !== this.props.activePanel) {
            this.props.data.parent.setState({activePanel: this.props.activePanel});
        }
    }

    render() {
        let itemData = this.props.data.parent.state.itemData;

        return (
            <div className='list-container-item'>
                <div className='item'>
                    <img className='item-image' src={itemData.imageUrl} />
                    <div className='item-title'>
                        {itemData.title}
                    </div>
                    <div className='item-points'>
                        + {itemData.points} ₽
                    </div>

                    <hr className='horizontal-line'/>
                    <div className='item-info item-price'>{itemData.price} ₽</div>
                    <div className='item-info item-date'>{itemData.date}</div>
                    <div className='item-info item-shop'>{itemData.shop}</div>
                    <div className='item-info item-description'>{itemData.description}</div>
                </div>
            </div>
        )
    }
}

const ItemInfo = connect(mapStateToProps, null)(ConnectedItemInfo);

export default ItemInfo;

