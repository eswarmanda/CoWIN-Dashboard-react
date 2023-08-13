import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const apiStatusConstents = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class CowinDashboard extends Component {
  state = {
    lastSevenDaysVaccination: [],
    vaccinationByGender: [],
    vaccinationByAge: [],
    apiStatus: apiStatusConstents.initial,
  }

  componentDidMount() {
    this.getCowinApiData()
  }

  getCowinApiData = async () => {
    this.setState({apiStatus: apiStatusConstents.inProgress})
    const url = `https://apis.ccbp.in/covid-vaccination-data`

    const response = await fetch(url)
    if (response.ok === true) {
      const fetchedData = await response.json()
      console.log(fetchedData)
      const formattedVaccinationDetails = fetchedData.last_7_days_vaccination.map(
        eachItem => ({
          dose1: eachItem.dose_1,
          dose2: eachItem.dose_2,
          vaccineDate: eachItem.vaccine_date,
        }),
      )
      const formattedVaccinationGender = fetchedData.vaccination_by_gender.map(
        eachItem => ({
          gender: eachItem.gender,
          count: eachItem.count,
        }),
      )
      const formattedVaccinationAge = fetchedData.vaccination_by_age.map(
        eachItem => ({
          age: eachItem.age,
          count: eachItem.count,
        }),
      )

      this.setState({
        lastSevenDaysVaccination: formattedVaccinationDetails,
        vaccinationByGender: formattedVaccinationGender,
        vaccinationByAge: formattedVaccinationAge,
        apiStatus: apiStatusConstents.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstents.failure})
    }
  }

  renderGraphInfo = () => {
    const {
      lastSevenDaysVaccination,
      vaccinationByAge,
      vaccinationByGender,
    } = this.state
    return (
      <div className="main-container">
        <div className="CoWin-Dashbord">
          <div className="logo-card">
            <img
              className="logo"
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              alt="website logo"
            />
            <h1 className="logo-title">Co-Win</h1>
          </div>
          <h2 className="description">CoWin Vaccination in India</h2>
          <VaccinationCoverage
            lastSevenDaysVaccination={lastSevenDaysVaccination}
          />
          <VaccinationByGender vaccinationByGender={vaccinationByGender} />
          <VaccinationByAge vaccinationByAge={vaccinationByAge} />
        </div>
      </div>
    )
  }

  renderLoadingView = () => {
    console.log('loading')
    return (
      <div className="main-container">
        <div className="CoWin-Dashbord">
          <div className="logo-card">
            <img
              className="logo"
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              alt="website logo"
            />
            <h1 className="logo-title">Co-Win</h1>
          </div>
          <h2 className="description">CoWin Vaccination in India</h2>
          <div data-testid="loader" className="loader">
            <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
          </div>
        </div>
      </div>
    )
  }

  renderFailureView = () => {
    console.log('failure')
    return (
      <div className="main-container">
        <div className="CoWin-Dashbord">
          <div className="logo-card">
            <img
              className="logo"
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              alt="website logo"
            />
            <h1 className="logo-title">Co-Win</h1>
          </div>
          <h2 className="description">CoWin Vaccination in India</h2>
          <div className="failure-view">
            <img
              src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
              alt="failure view"
            />
            <h1>Something Went Wrong</h1>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstents.inProgress:
        return this.renderLoadingView()
      case apiStatusConstents.success:
        return this.renderGraphInfo()
      case apiStatusConstents.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }
}
export default CowinDashboard
