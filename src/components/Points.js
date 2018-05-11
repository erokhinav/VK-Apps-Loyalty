import React from 'react';
import * as UI from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import { colors } from '@vkontakte/vkui';
import '../style/points.css';
import { connect } from "react-redux";
import { goBack } from "../redux/actions/index";

const mapStateToProps = state => {
    return {
        activePanel: state.activePanel,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        goBack: view => dispatch(goBack(view)),
    };
};

class ConnectedPoints extends React.Component {

    constructor(props) {
        super(props);

        let connect = this.props.data.connect;
        connect.subscribe((e) => {
            e = e.detail;
            if (e['type'] === 'VKWebAppGetPhoneNumberResult' && e['data']['phone_number'] !== null) {
                document.getElementById('mobile-number').value = e['data']['phone_number'];
            }
        });
        connect.send('VKWebAppGetPhoneNumber');

        this.phoneNumberPrompt = 'Введите моб. телефон';
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.activePanel !== this.props.activePanel) {
            this.props.data.parent.setState({activePanel: this.props.activePanel});
        }
    }

    openNotifyDialog() {
        let parent = this.props.data.parent;
        let self = this;
        let connect = this.props.data.connect;
        parent.setState({ popout:
                <UI.Alert
                    actions={[{
                        title: 'OK',
                        autoclose: true,
                        style: 'destructive'
                    }]}
                    onClose={ () => {
                        parent.setState({popout: null}, () => {
                            self.props.goBack('Points');
                            connect.send('VKWebAppViewUpdateNavigationState', {canBack: false, canForward: true}); }
                            )}
                    }
                >
                    <h2>Баллы начислены</h2>
                    <p>Вам начислено 10 баллов.</p>
                </UI.Alert>
        });
    }

    render() {
        return (
            <UI.Pane>
                Нам нужен Ваш мобильный номер, чтобы мы могли начислять Вам баллы
                <textarea id='mobile-number' className='mobile-number'
                          defaultValue={this.phoneNumber === undefined ? this.phoneNumberPrompt : this.phoneNumber}
                          onFocus={() => {
                    let el = document.getElementById('mobile-number');
                    el.setAttribute('border', 'none');
                    if (el.value === el.defaultValue) {
                        el.value = '';
                    }
                }}
                          onBlur={() => {
                    let el = document.getElementById('mobile-number');
                    if (el.value === '') {
                        el.value = el.defaultValue;
                    }
                }}/>
                <UI.Button appearance='vk-rich' className='accept-button' onClick={() => {
                    this.openNotifyDialog();
                }}>
                    <div className='accept-button-text'>
                        Отправить
                    </div>
                </UI.Button>
            </UI.Pane>
        )
    }
}

const Points = connect(mapStateToProps, mapDispatchToProps)(ConnectedPoints);

export default Points;

