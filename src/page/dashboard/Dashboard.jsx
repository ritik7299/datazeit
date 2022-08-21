import React, { useEffect, useState } from 'react'
import { Row, Col, Spin, Table, Pagination } from 'antd'
import SideMenu from '../../component/dashboard/SideMenu'
import axios from 'axios';
import Overview from '../../component/dashboard/Overview';

const Dashboard = () => {

	const [responseData, setResponseData] = useState(false)
	const [apiError, setApiError] = useState(null)
	const [current, setCurrent] = useState(1)
	const [total, setTotal] = useState(1)
	const [filterData, setFilterData] = useState(false)
	const [priceRange, setPriceRange] = useState(undefined)
	const [discount, setDiscount] = useState(undefined)

	useEffect(() => {
		fetchData()
	}, [current])

	const fetchData = async () => {
		setResponseData(false)
		setFilterData(false)
		try {
			const response = await axios.get(`https://dummyjson.com/products?skip=${(100 - current * 10)}&limit=10`)
			setResponseData(response.data.products)
			setFilterData(response.data.products)
			setTotal(response.data.total)
			setApiError(null)
		} catch (err) {
			setApiError(err)
		}
	}

	const pagination = (page) => {
		resetFilters()
		setCurrent(page)
	}

	const onFilterApply = () => {
		setFilterData(responseData?.filter(response =>
			(priceRange ? (response.price >= priceRange[0] && response.price <= priceRange[1]) : true)
			&&
			(discount ? (response.discountPercentage <= discount) : true)
		))
	}

	const resetFilters = () => {
		setDiscount(undefined)
		setPriceRange(undefined)
		setFilterData(responseData)
	}

	return (
		filterData ?
			<Row gutter={[20, 20]}>
				<Col lg={6}>
					<SideMenu filterData={filterData}
						setPriceRange={(value) => setPriceRange(value)} priceRange={priceRange}
						setDiscount={(value) => setDiscount(value)} discount={discount} onFilterApply={onFilterApply}
						resetFilters={resetFilters} />
				</Col>

				<Col lg={18}>
					<Overview filterData={filterData} current={current} pagination={pagination} total={total} resetFilters={resetFilters} />
				</Col>

			</Row>
			:
			<div className='cs-vh100 cs-vt-center cs-hrz-center cs-dis-flex'>
				<Spin />
			</div>
	)
}

export default Dashboard