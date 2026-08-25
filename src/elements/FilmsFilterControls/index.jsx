import React, { useState } from "react";
import { ConfigProvider, Select, Slider } from "antd";
import style from "./style.module.scss";
import { StarFilled } from "@ant-design/icons";

const { Option } = Select;

const FilmsFilterControls = ({ sortType, sortYear, rating, onChange }) => {

    const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

    const handleLatestClick = () => {
        const newType = sortType === "latest" ? null : "latest";
        onChange?.({ sortType: newType, sortYear: null, rating: rating });
    };

    const handleYearChange = (year) => {
        onChange?.({ sortType: year ? "year" : null, sortYear: year, rating: rating });
    };

    const handleRatingChange = (value) => {
        onChange?.({ sortType: sortType, sortYear: sortYear, rating: value });
    };

    return (
        <div className={style.sortControls}>
            <div className={style.group1}>
                <span className={style.label}>Sort by</span>
                <button
                    className={`${style.latestBtn} ${sortType === "latest" ? style.active : ""}`}
                    onClick={handleLatestClick}
                >
                    Latest
                </button>

                <ConfigProvider theme={{ components: { Select: { colorText: '#f9f1e4' } } }}>
                    <Select
                        allowClear
                        placeholder="Year"
                        className={style.yearSelect}
                        value={sortType === "year" ? sortYear : null}
                        onChange={handleYearChange}
                        dropdownClassName={style.yearDropdown}
                    >
                        {years.map((y) => (
                            <Option key={y} value={y}>
                                {y}
                            </Option>
                        ))}
                    </Select>
                </ConfigProvider>
            </div>
            <div className={style.ratingControl}>
                <StarFilled className={style.starIcon} />
                <Slider
                    min={0}
                    max={10}
                    step={0.1}
                    value={rating}
                    onChange={handleRatingChange}
                    className={style.ratingSlider}
                />
                <span className={style.ratingValue}>{rating.toFixed(1)}</span>
            </div>
        </div>
    );
};

export default FilmsFilterControls;;
