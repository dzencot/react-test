import React from 'react';
import _ from 'lodash';
import cn from 'classnames';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import '../css/Basket.css';
import { setEmptyBasket, addItem, incrementItem, decrementItem, removeItem } from '../actions';

const mapStateToProps = state => {
  const props = {
    appState: state.appState,
    basket: state.basket,
  };
  return props;
};

class Basket extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showBasket: false, showPayModal: false, payingProcess: true };
  }

  incrementItem = (item) => {
    const { dispatch } = this.props;
    dispatch(incrementItem(item));
  };

  decrementItem = (item) => {
    const { dispatch } = this.props;
    dispatch(decrementItem(item));
  };

  removeItem = (item) => {
    const { dispatch } = this.props;
    dispatch(removeItem(item));
  };

  pay = () => {
    this.openModalPay();
    this.payingProcess();
  }

  openModalPay = () => {
    this.setState({
      showPayModal: true,
      showBasket: false,
    });
  };

  closeModalPay = () => {
    this.setState({
      showPayModal: false,
      payingProcess: true,
    });
  };

  payingProcess = () => {
    setTimeout(() => {
      this.setState({ payingProcess: false });
      const { dispatch } = this.props;
      dispatch(setEmptyBasket());
    }, 1000);
  };

  renderSpinner() {
    return <div className="basket-pay-modal-spinner"><img src="/spinner.gif" /></div>;
  }

  renderPayingResult() {
    const itemsData = _.toArray(_.get(this.props, 'basket.items', []));
    const renderPayedItem = (data) => {
      const { item, countItem } = data;
      const amount = parseFloat(item.price) * _.parseInt(countItem);
      return <div key={item.id} className="basket-pay-modal-result-item">
        <div className="basket-pay-modal-result-item-title">
          {`${item.title}(${countItem})`}
        </div>
        <div className="basket-pay-modal-result-item-amount">
          {amount}
        </div>
      </div>
    };

    return <div className="basket-pay-modal-result">
      {itemsData.map(renderPayedItem)}
      <div className="basket-pay-modal-result-info">Оплата прошла успешно</div>
    </div>;
  }

  renderPayModal() {
    const { showPayModal, payingProcess } = this.state;
    Modal.setAppElement('#container');

    return <Modal
      className="basket-pay-modal"
      isOpen={showPayModal}
      overlayClassName="basket-pay-modal-overlay"
    >
      <div className="basket-pay-modal-title">
        Процесс оплаты
        <div className="basket-pay-modal-close" onClick={this.closeModalPay} />
      </div>
      {payingProcess ? this.renderSpinner() : this.renderPayingResult()}
    </Modal>
  }

  changeCountItem = item => event => {
    const countItem = event.target.value;
    const { dispatch } = this.props;
    dispatch(addItem({ item, countItem }));
  };

  renderItem = (dataItem) => {
    const { item, countItem } = dataItem;
    return <div className="basket-item" key={item.id}>
      <div className="basket-item-title">
        {item.title}
      </div>
      <div className="basket-item-count">
        <input className="basket-item-count-input" type="number" value={countItem} onChange={this.changeCountItem(item)} />
        <div className="basket-item-count-buttons">
          <div className="basket-item-count-button">
            <button className="basket-item-count-button basket-item-count-increment"
              onClick={() => this.incrementItem(item)}
            >
              <div className="basket-arrow-up" />
            </button>
          </div>
          <div className="basket-item-count-button">
            <button className="basket-item-count-button basket-item-count-decrement"
              onClick={() => this.decrementItem(item)}
            >
              <div className="basket-arrow-down" />
            </button>
          </div>
        </div>
        <div className="close" onClick={() => this.removeItem(item)} />
      </div>
    </div>;
  }

  renderBasket = ({ totalPrice, totalCount }) => {
    const items = _.toArray(_.get(this.props, 'basket.items', []));
    const { showBasket } = this.state;
    const classesBasket = cn({
      hidden: !showBasket,
      'basket-block': true,
    });

    return <div className={classesBasket}>
      <div className="basket-items">
        {items.map(this.renderItem)}
      </div>
      <div className="basket-pay-button">
        <div className="basket-pay-info">
          <span>Итого: {totalPrice}</span><br />
          <span>Общее количество: {totalCount}</span>
        </div>
        <button className="basket-pay-button" onClick={this.pay}>Оплатить</button>
      </div>
    </div>;
  }

  toggleBasket = () => {
    this.setState({
      showBasket: !this.state.showBasket,
    });
  };

  render() {
    const items = _.toArray(_.get(this.props, 'basket.items', []));
    const { totalPrice, totalCount } = items.reduce((carry, { countItem, item }) => {
      const { price } = item;
      carry.totalCount += countItem;
      carry.totalPrice += (countItem * price);
      return carry;
    }, { totalPrice: 0, totalCount: 0 });

    return (
      <div className="basket">
        <div className="basket-panel" onClick={this.toggleBasket}>
          Корзина:<br />
          {totalPrice} {totalCount}
        </div>
        {this.renderBasket({ totalPrice, totalCount })}
        {this.renderPayModal()}
      </div>
    );
  }
}

export default connect(mapStateToProps)(Basket);
