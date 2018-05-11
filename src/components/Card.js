import React from 'react';
import '@vkontakte/vkui/dist/vkui.css';
import { colors } from '@vkontakte/vkui';
import '../style/card.css';
import {connect} from "react-redux";

const mapStateToProps = state => {
    return {
        activePanel: state.activePanel,
    };
};

class ConnectedCard extends React.Component {

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.activePanel !== this.props.activePanel) {
            this.props.data.parent.setState({activePanel: this.props.activePanel});
        }
    }

    render() {
        return (
            <div className='card-container'>
                <div className='show-card-text'>
                    ПОКАЖИТЕ ЭТОТ ЭКРАН КАССИРУ
                </div>
                <img className='card-wrapper' src='cardExample.png' />
            </div>
        )
    }
}

const Card = connect(mapStateToProps, null)(ConnectedCard);

export default Card;

