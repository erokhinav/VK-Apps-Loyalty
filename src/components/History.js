import React from 'react';
import * as UI from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import { colors } from '@vkontakte/vkui';
import '../style/history.css';
import '../style/common.css';
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

class ConnectedHistory extends React.Component {

    constructor(props) {
        super(props);

        if (props.show != null && props.show !== undefined) {
            this.items = props.items.slice(0, props.show);
        } else {
            this.items = props.items;
        }

        let itemsSize = this.items.length;
        for (let index = 0; index < itemsSize; index++) {
            this.items[index]['key'] = index;
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.activePanel !== this.props.activePanel && !this.props.main) {
            this.props.data.parent.setState({activePanel: this.props.activePanel});
        }
    }

    render() {
        let parent = this.props.data.parent;
        let items = this.items;
        let self = this;

        return (
            <div className='list-container-history'>
                { this.props.header ?
                    <UI.Pane className='view-header'>История покупок</UI.Pane>
                    : null }
                <UI.List>
                    {
                        items.map(function(itemData) {
                            return (
                                <div className='history-list-item'>
                                    <UI.ListItem key={itemData.key}
                                                 onClick={ () => {
                                                     parent.setState({itemData: itemData}, () => {
                                                         self.props.viewForward({newView: 'ItemInfo',
                                                             oldView: self.props.main ? 'Main' : 'History'});
                                                         self.props.data.connect.send('VKWebAppViewUpdateNavigationState', {canBack: true, canForward: false});
                                                     });
                                                 } }>
                                        <HistoryItem data={itemData}/>
                                    </UI.ListItem>
                                </div>
                            );
                        })
                    }
                 </UI.List>
            </div>
        );
    }
}

class HistoryItem extends React.Component {

    render() {
        let data = this.props.data;

        return (
            <div className='history-item'>
                <div className='history-item-photo'>
                    <img className='history-item-photo image' src={data.imageUrl}/>
                </div>
                <div className='history-item-name-and-description'>
                    <div className='history-item-name'>
                        {data.title}
                    </div>
                    <div className='history-item-description'>
                        {data.date}
                    </div>
                </div>
                <div className='history-item-points'>
                    + {data.points} ₽
                </div>
            </div>
        )
    }
}

const History = connect(mapStateToProps, mapDispatchToProps)(ConnectedHistory);

export default History;

