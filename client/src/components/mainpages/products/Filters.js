import React, {useContext} from 'react'
import {GlobalState} from '../../../GlobalState'

function Filters() {
    const state = useContext(GlobalState)
    const [categories] = state.categoriesAPI.categories

    const [category, setCategory] = state.productsAPI.category
    const [sort, setSort] = state.productsAPI.sort
    const [search, setSearch] = state.productsAPI.search


    const handleCategory = e => {
        setCategory(e.target.value)
        setSearch('')
    }

    return (
        <div className="filter_menu">
            <div className="row">
                <span>Filters: </span>
                <select name="category" value={category} onChange={handleCategory} >
                    <option value=''>Tất cả sản phẩm</option>
                    {
                        categories.map(category => (
                            <option value={"category=" + category._id} key={category._id}>
                                {category.name}
                            </option>
                        ))
                    }
                </select>
            </div>

            <input type="text" value={search} placeholder="Enter your search!"
            onChange={e => setSearch(e.target.value.toLowerCase())} />

            <div className="row sort">
                <span>Sắp xếp: </span>
                <select value={sort} onChange={e => setSort(e.target.value)} >
                    <option value=''>Mới nhất</option>
                    <option value='sort=oldest'>Cũ nhất</option>
                    <option value='sort=-sold'>Bán nhiều nhất</option>
                    <option value='sort=-price'>Giá: Cao đến thấp</option>
                    <option value='sort=price'>Giá: Thấp đến cao</option>
                </select>
            </div>
        </div>
    )
}

export default Filters
