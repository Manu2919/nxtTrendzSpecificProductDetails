import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConsonants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    itemCount: 1,
    productsData: {},
    similarProducts: [],
    apiStatus: apiStatusConsonants.initial,
  }

  // Making an api call to get product details
  componentDidMount = () => {
    this.getProductItemDetails()
  }

  getFormattedData = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  getProductItemDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({apiStatus: apiStatusConsonants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok) {
      const updatedData = this.getFormattedData(data)
      const updatedSimilarProductsData = data.similar_products.map(
        eachProduct => this.getFormattedData(eachProduct),
      )
      this.setState({
        productsData: updatedData,
        similarProducts: updatedSimilarProductsData,
        apiStatus: apiStatusConsonants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConsonants.failure})
    }
  }

  // on loading view

  renderLoadingView = () => (
    <div data-testid="loader" className="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  // on failure render view

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-img"
      />
      <h1 className="failure-title">Product Not Found</h1>
      <Link to="/products" className="btn-link">
        <button type="button" className="continue-shopping-btn">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  onDecreaseCount = () => {
    const {itemCount} = this.state
    if (itemCount > 1) {
      this.setState(prevState => ({itemCount: prevState.itemCount - 1}))
    }
  }

  onIncreaseCount = () => {
    this.setState(prevState => ({itemCount: prevState.itemCount + 1}))
  }

  // on success rendering products view
  renderProductDetailsView = () => {
    const {productsData, itemCount, similarProducts} = this.state
    const {
      imageUrl,
      title,
      price,
      rating,
      totalReviews,
      description,
      availability,
      brand,
    } = productsData

    return (
      <div className="container">
        <div className="product-details-view-container">
          <img src={imageUrl} alt="product" className="product-item-image" />
          <div className="product-details-card">
            <h1 className="image-title">{title}</h1>
            <p className="price-para">Rs {price}/-</p>
            <div className="review-rating-card">
              <div className="review-card">
                <p className="review">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-logo"
                />
              </div>
              <p className="total-reviews">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <div className="label-value-container">
              <p className="available">Available: </p>
              <p className="available-value"> {availability}</p>
            </div>
            <div className="label-value-container">
              <p className="available">Brand: </p>
              <p className="available-value"> {brand}</p>
            </div>
            <hr className="line" />
            <div className="quantity-container">
              <button
                type="button"
                data-testid="minus"
                className="btn"
                onClick={this.onDecreaseCount}
              >
                <BsDashSquare className="minus-icon" />
              </button>
              <p className="quantity">{itemCount}</p>
              <button
                type="button"
                data-testid="plus"
                className="btn"
                onClick={this.onIncreaseCount}
              >
                <BsPlusSquare className="minus-icon" />
              </button>
            </div>
            <button type="button" className="cart-btn">
              Add To Cart
            </button>
          </div>
        </div>
        <h1 className="similar-products">Similar Products</h1>
        <ul className="unordered-list">
          {similarProducts.map(eachProduct => (
            <SimilarProductItem
              productDetails={eachProduct}
              key={eachProduct.id}
            />
          ))}
        </ul>
      </div>
    )
  }

  renderProductDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConsonants.success:
        return this.renderProductDetailsView()
      case apiStatusConsonants.failure:
        return this.renderFailureView()
      case apiStatusConsonants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="ProductItemDetails-container">
        <Header />
        {this.renderProductDetails()}
      </div>
    )
  }
}

export default ProductItemDetails
