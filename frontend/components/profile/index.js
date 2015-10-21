import React from 'react';
import UserStore from '../../stores/user';
import PopupActions from '../../actions/popup';
import UserActions from '../../actions/user';

let getUserInfo = () => {
    return UserStore.getUserInfo();
};

let getPaymentProgress = () => {
    return UserStore.isPaymentProgress();
};

export default class Profile extends React.Component {

    constructor() {
        super();
        this.state = {user: getUserInfo()};
    }

    componentDidMount() {
        UserStore.addChangeListener(this.onChange);

    }

    componentWillUnmount() {
        UserStore.removeChangeListener(this.onChange);
    }

    onChange = () => {
        this.setState({
            user: getUserInfo(),
            paymentProgress: getPaymentProgress()
        });
    };

    closePopup() {
        PopupActions.closePopup();
    }

    send = (num, amount, e) => {
        let handler = window.StripeCheckout.configure({
            key: 'pk_test_Bxdiy9BekZWdsGOigzQ3J3i6',
            locale: 'auto',
            token: function (token) {
                UserActions.newPayment({
                    token: token.id,
                    amount: amount,
                    num: num
                });
                // Use the token to create the charge with a server-side script.
                // You can access the token ID with `token.id`
            }
        });
        handler.open({
            name: 'SHRED',
            description: num + ' файлов',
            amount: amount * 100
        });
        e.preventDefault();
    };

    render() {
        let payment = '';
        if (this.state.paymentProgress) {
            payment = (
              <div className="profile__payment-progress">
                  Оплата в процессе
              </div>
            );
        }
        return (
            <div className="profile">
                <div className="popup__close" onClick={this.closePopup}>X</div>
                <div className="profile__info">
                    <div className="profile__title">
                        Информация о пользователе:
                    </div>
                    <div className="profile__row">
                        <span className="profile__row-title">
                            Имя:
                        </span>
                        <span className="profile__row-text">
                            {this.state.user.displayName}
                        </span>
                    </div>
                    <div className="profile__row">
                        <span className="profile__row-title">
                            Логин:
                        </span>
                        <span className="profile__row-text">
                            {this.state.user.userName}
                        </span>
                    </div>
                    <div className="profile__row">
                        <span className="profile__row-title">
                            Доступно сообщений для сохранения:
                        </span>
                        <span className="profile__row-text">
                            {this.state.user.messageAvailable - this.state.user.messageUsed}
                        </span>
                    </div>
                    <div className="profile__row">
                        <div className="profile__row-title">
                            Купить файлы:
                        </div>
                        {payment}

                        <div className="profile__button">
                            <div className="profile__button-text">
                                5 файлов, 1$
                            </div>
                            <button onClick={this.send.bind(this, 5, 1)}>Купить</button>
                        </div>


                        <div className="profile__button">
                            <div className="profile__button-text">
                                10 файлов, 2$
                            </div>
                            <button onClick={this.send.bind(this, 10, 2)}>Купить</button>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}