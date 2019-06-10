import React from 'react';
import _ from 'lodash';
import cn from 'classnames';
import Modal from 'react-modal';
import { connect } from 'react-redux';
import '../css/Basket.css';
import { setEmptyBasket, addItem, incrementItem, decrementItem, removeItem, itemCountChange } from '../actions';
import { config } from '../config';
import { Circle } from 'rc-progress';

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
    const savedData = sessionStorage.getItem(config.appCode);
    const parsedData = JSON.parse(savedData);
    const { items } = parsedData || { items: [] };
    _.forEach(items, (element) => {
      const { item, countItem } = element;
      const { dispatch } = this.props;
      dispatch(addItem({ item, countItem }));
    });

    this.state = {
      showBasket: false,
      showPayModal: false,
      payingProcess: false,
      intervalId: '',
      payProgress: 0,
    };

    this.node = React.createRef();
  }

  componentWillUnmount() {
    const { intervalId } = this.state;
    if (intervalId) {
      clearInterval(intervalId);
    }
    document.removeEventLisener('mousedown', this.handleClick, false);
  }

  componentWillMount() {
    document.addEventListener('mousedown', this.handleClick, false);
  }

  handleClick = (e) => {
    // TODO: не работает, найти способ как остановить события других компонентов
    // if (e.nativeEvent) {
    //   e.stopImmediatePropagation();
    // }
    if (!this.node.current.contains(e.target)) {
      e.stopPropagation();
      e.stopImmediatePropagation();
      this.setState({
        showBasket: false,
      });
    }
  };

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
    const items = _.toArray(_.get(this.props, 'basket.items', []));
    if (items && items.length > 0) {
      this.setState({
        payingProcess: true,
      });
      this.openModalPay();
      this.payingProcess();
    }
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
    // TODO: переделать опустошение корзины
    const { dispatch } = this.props;
    dispatch(setEmptyBasket());
  };

  payingProcess = () => {
    const timer = () => {
      const payProgress = _.parseInt(this.state.payProgress) + 5;
      if (payProgress === 100) {
        this.setState({ payingProcess: false });
        clearInterval(this.state.intervalId);
      }

      this.setState({ payProgress });
    };
    const intervalId = setInterval(timer, 100);
    this.setState({ intervalId, payProgress: 0 });
  };

  renderSpinner() {
    const { payProgress } = this.state;
    return <div className="basket-pay-modal-spinner"><Circle percent={payProgress} strokeColor="blue" strokeWidth="5" className="basket-pay-modal-spinner-circle" /></div>;
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
          {parseFloat(amount).toFixed(2)}
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
    dispatch(itemCountChange({ item, countItem }));
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

    return <div className={classesBasket} >
      <div className="basket-items">
        {items.map(this.renderItem)}
      </div>
      <div className="basket-pay-button">
        <div className="basket-pay-info">
          <span>Итого: {parseFloat(totalPrice, 2).toFixed(2)}</span><br />
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
      carry.totalCount += (_.parseInt(countItem) || 0);
      carry.totalPrice += ((_.parseInt(countItem) || 0) * (parseFloat(price) || 0));
      return carry;
    }, { totalPrice: 0, totalCount: 0 });

    return (
      <div className="basket" ref={this.node}>
        <div className="basket-panel" onClick={this.toggleBasket}>
          Корзина:<br />
          {parseFloat(totalPrice, 2).toFixed(2)} {totalCount}
        </div>
        {this.renderBasket({ totalPrice, totalCount })}
        {this.renderPayModal()}
      </div>
    );
  }
}

export default connect(mapStateToProps)(Basket);
