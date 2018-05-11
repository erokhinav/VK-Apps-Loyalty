import React from 'react';
import * as UI from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import '../style/help.css';
import '../style/common.css';
import { colors } from '@vkontakte/vkui';
import {connect} from "react-redux";

const mapStateToProps = state => {
    return {
        activePanel: state.activePanel,
        panelBack: state.panelBack,
        panelForward: state.panelForward,
    };
};

class ConnectedHelp extends React.Component {

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.activePanel !== this.props.activePanel) {
            this.props.data.parent.setState({activePanel: this.props.activePanel});
        }
    }

    render() {
        return (
            <div className='container-help'>
                <UI.Pane className='view-header'>Поддержка</UI.Pane>
                <div className='hint'>
                    Нужна помощь? Напишите нам о своей проблеме.</div>
                <div id='open-dialog-button' className='open-dialog-button-container'>
                    <UI.Button appearance="vk-wide-primary" className='open-dialog-button'
                    onClick={() => {
                        window.location = 'https://vk.com/im?sel=-163548171';
                    }}>
                        Написать нам</UI.Button>
                </div>
            </div>
        )
    }
}

const Help = connect(mapStateToProps, null)(ConnectedHelp);

export default Help;

