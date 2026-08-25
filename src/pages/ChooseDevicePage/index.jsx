import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IoIosArrowDropleftCircle } from "react-icons/io";
import style from './style.module.scss';

const ChooseDevicePage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedDevices, setSelectedDevices] = useState([]);
    const { devices = "zero" } = location.state || {};

    const handleBack = () => {
        navigate(-1); // Перенаправлення на PlanPage
    };
    const handleHomePage = () => {
        navigate('/'); // Перенаправлення на HomePage
    };

    const deviceCountMap = {
        zero: 0,
        one: 1,
        two: 2,
        three: 3,
        four: 4,
    };

    // Перетворення текстового значення в числове
    const deviceCount = deviceCountMap[devices] ?? 0;

    const handleDeviceClick = (deviceName) => {
        if (selectedDevices.includes(deviceName)) {
            setSelectedDevices(selectedDevices.filter(device => device !== deviceName)); // Видаляємо пристрій, якщо він вже вибраний
        } else if (selectedDevices.length < deviceCount) {
            setSelectedDevices([...selectedDevices, deviceName]); // Додаємо пристрій, якщо кількість вибраних менше дозволеного
        }
    };

    const isDeviceSelected = (deviceName) => selectedDevices.includes(deviceName);

    const isAllDevicesSelected = selectedDevices.length === deviceCount;
    console.log(selectedDevices);


    return (
        <>
            <IoIosArrowDropleftCircle
                className={style.arrowBack}
                onClick={handleBack}
            />
            <div className={style.container}>
                <div className='row g-4'>
                    {/* ============================== */}
                    {/* TODO: адаптивність для менших екранів замість col-5 зробити col-4 */}
                    {/* ============================== */}
                    <div className={`col-5 ${style.text}`}>
                        <h3 className={style.title}>Choose {devices} devices to watch on</h3>
                    </div>
                    <div className='col'>
                        <button type='button'
                            className={`${style.button} ${isDeviceSelected('TV') ? style.selected : ''}`}
                            onClick={() => handleDeviceClick('TV')}>
                            <div className={style.buttonInner}>
                                <svg width="70" height="70" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path className={style.buttonIcon} d="M58.3333 45.833V79.1663H20.8333V45.833H58.3333ZM100 45.833V79.1663C100 90.6538 90.6542 99.9996 79.1667 99.9996H20.8333C9.34583 99.9996 0 90.6538 0 79.1663V45.833C0 34.3455 9.34583 24.9996 20.8333 24.9996H41.1042L25.9667 6.83295C24.4917 5.06629 24.7333 2.43712 26.5 0.966288C28.2667 -0.508712 30.8917 -0.267045 32.3667 1.49962L50 22.658L67.6333 1.49962C69.1083 -0.267045 71.7333 -0.504545 73.5 0.966288C75.2667 2.43712 75.5042 5.06629 74.0333 6.83295L58.8958 24.9996H79.1667C90.6542 24.9996 100 34.3455 100 45.833ZM66.6667 45.833C66.6667 41.2371 62.9292 37.4996 58.3333 37.4996H20.8333C16.2375 37.4996 12.5 41.2371 12.5 45.833V79.1663C12.5 83.7621 16.2375 87.4996 20.8333 87.4996H58.3333C62.9292 87.4996 66.6667 83.7621 66.6667 79.1663V45.833ZM89.5833 72.9163C89.5833 69.4663 86.7833 66.6663 83.3333 66.6663C79.8833 66.6663 77.0833 69.4663 77.0833 72.9163C77.0833 76.3663 79.8833 79.1663 83.3333 79.1663C86.7833 79.1663 89.5833 76.3663 89.5833 72.9163ZM89.5833 52.083C89.5833 48.633 86.7833 45.833 83.3333 45.833C79.8833 45.833 77.0833 48.633 77.0833 52.083C77.0833 55.533 79.8833 58.333 83.3333 58.333C86.7833 58.333 89.5833 55.533 89.5833 52.083Z" fill="#5B5B5B" />
                                </svg>
                                <p className={style.buttonName}>TV</p>
                            </div>
                        </button>
                    </div>
                    <div className='col'>
                        <button type='button'
                            className={`${style.button} ${isDeviceSelected('Laptop') ? style.selected : ''}`}
                            onClick={() => handleDeviceClick('Laptop')}>
                            <div className={style.buttonInner}>
                                <svg width="70" height="70" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path className={style.buttonIcon} d="M91.667 63.2667V33.3333C91.6604 27.81 89.4633 22.5148 85.5578 18.6092C81.6522 14.7037 76.357 12.5066 70.8337 12.5H29.167C23.6437 12.5066 18.3485 14.7037 14.4429 18.6092C10.5374 22.5148 8.3403 27.81 8.33368 33.3333V63.2667C5.55584 64.2451 3.21391 66.175 1.72269 68.7147C0.231461 71.2544 -0.312823 74.2399 0.186235 77.1424C0.685293 80.0449 2.19549 82.6772 4.44934 84.5729C6.70319 86.4687 9.55524 87.5056 12.5003 87.5H87.5004C90.4455 87.5056 93.2975 86.4687 95.5514 84.5729C97.8052 82.6772 99.3154 80.0449 99.8145 77.1424C100.314 74.2399 99.7692 71.2544 98.278 68.7147C96.7868 66.175 94.4449 64.2451 91.667 63.2667ZM29.167 20.8333H70.8337C74.1489 20.8333 77.3283 22.1503 79.6725 24.4945C82.0167 26.8387 83.3337 30.0181 83.3337 33.3333V62.5H66.0378C64.826 62.4992 63.6285 62.7627 62.5289 63.2722C61.4293 63.7817 60.4541 64.5249 59.6712 65.45L58.642 66.6667H41.3545L40.3295 65.45C39.5466 64.5249 38.5714 63.7817 37.4718 63.2722C36.3722 62.7627 35.1747 62.4992 33.9628 62.5H16.667V33.3333C16.667 30.0181 17.984 26.8387 20.3282 24.4945C22.6724 22.1503 25.8518 20.8333 29.167 20.8333ZM87.5004 79.1667H12.5003C11.3953 79.1667 10.3355 78.7277 9.55407 77.9463C8.77267 77.1649 8.33368 76.1051 8.33368 75C8.33368 73.8949 8.77267 72.8351 9.55407 72.0537C10.3355 71.2723 11.3953 70.8333 12.5003 70.8333H33.967L34.992 72.05C35.7744 72.9745 36.749 73.7174 37.8478 74.2269C38.9467 74.7364 40.1433 75.0002 41.3545 75H58.642C59.8539 75.0008 61.0514 74.7373 62.151 74.2278C63.2506 73.7183 64.2258 72.9751 65.0087 72.05L66.0378 70.8333H87.5004C88.6054 70.8333 89.6652 71.2723 90.4466 72.0537C91.228 72.8351 91.667 73.8949 91.667 75C91.667 76.1051 91.228 77.1649 90.4466 77.9463C89.6652 78.7277 88.6054 79.1667 87.5004 79.1667Z" fill="#5B5B5B" />
                                </svg>
                                <p className={style.buttonName}>Laptop</p>
                            </div>
                        </button>
                    </div>
                </div>
                <div className={`row ${style.specialRow}`}>
                    <div className='col'>
                        <button type='button'
                            className={`${style.button} ${isDeviceSelected('Computer') ? style.selected : ''}`}
                            onClick={() => handleDeviceClick('Computer')}>
                            <div className={style.buttonInner}>
                                <svg width="70" height="70" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_549_1056)">
                                        <path className={style.buttonIcon} d="M79.1667 4.1665H20.8333C15.31 4.17312 10.0148 6.37018 6.10925 10.2758C2.20367 14.1813 0.00661607 19.4765 0 24.9998L0 58.3332C0.00661607 63.8565 2.20367 69.1517 6.10925 73.0573C10.0148 76.9628 15.31 79.1599 20.8333 79.1665H45.8333V87.4998H29.1667C28.0616 87.4998 27.0018 87.9388 26.2204 88.7202C25.439 89.5016 25 90.5614 25 91.6665C25 92.7716 25.439 93.8314 26.2204 94.6128C27.0018 95.3942 28.0616 95.8332 29.1667 95.8332H70.8333C71.9384 95.8332 72.9982 95.3942 73.7796 94.6128C74.561 93.8314 75 92.7716 75 91.6665C75 90.5614 74.561 89.5016 73.7796 88.7202C72.9982 87.9388 71.9384 87.4998 70.8333 87.4998H54.1667V79.1665H79.1667C84.69 79.1599 89.9852 76.9628 93.8907 73.0573C97.7963 69.1517 99.9934 63.8565 100 58.3332V24.9998C99.9934 19.4765 97.7963 14.1813 93.8907 10.2758C89.9852 6.37018 84.69 4.17312 79.1667 4.1665ZM20.8333 12.4998H79.1667C82.4819 12.4998 85.6613 13.8168 88.0055 16.161C90.3497 18.5052 91.6667 21.6846 91.6667 24.9998V54.1665H8.33333V24.9998C8.33333 21.6846 9.65029 18.5052 11.9945 16.161C14.3387 13.8168 17.5181 12.4998 20.8333 12.4998ZM79.1667 70.8332H20.8333C18.2572 70.8225 15.7474 70.0162 13.6471 68.5245C11.5468 67.0328 9.95868 64.9286 9.1 62.4998H90.9C90.0413 64.9286 88.4532 67.0328 86.3529 68.5245C84.2526 70.0162 81.7428 70.8225 79.1667 70.8332Z" fill="#5B5B5B" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_549_1056">
                                            <rect width="100" height="100" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                                <p className={style.buttonName}>Computer</p>
                            </div>
                        </button>
                    </div>
                    <div className='col'>
                        <button type='button'
                            className={`${style.button} ${isDeviceSelected('Tablet') ? style.selected : ''}`}
                            onClick={() => handleDeviceClick('Tablet')}>
                            <div className={style.buttonInner}>
                                <svg width="70" height="70" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path className={style.buttonIcon} d="M68.7497 0H31.2497C18.6122 0 8.33301 10.2792 8.33301 22.9167V77.0833C8.33301 89.7208 18.6122 100 31.2497 100H68.7497C81.383 100 91.6664 89.7208 91.6664 77.0833V22.9167C91.6664 10.2792 81.383 0 68.7497 0ZM79.1663 77.0833C79.1663 82.825 74.4955 87.5 68.7497 87.5H31.2497C25.508 87.5 20.833 82.825 20.833 77.0833V22.9167C20.833 17.175 25.508 12.5 31.2497 12.5H68.7497C74.4955 12.5 79.1663 17.175 79.1663 22.9167V77.0833ZM58.333 72.9167C58.333 76.3708 55.533 79.1667 52.083 79.1667H47.9163C44.4622 79.1667 41.6663 76.3708 41.6663 72.9167C41.6663 69.4625 44.4622 66.6667 47.9163 66.6667H52.083C55.533 66.6667 58.333 69.4625 58.333 72.9167Z" fill="#5B5B5B" />
                                </svg>
                                <p className={style.buttonName}>Tablet</p>
                            </div>
                        </button>
                    </div>
                    <div className='col'>
                        <button type='button'
                            className={`${style.button} ${isDeviceSelected('Phone') ? style.selected : ''}`}
                            onClick={() => handleDeviceClick('Phone')}>
                            <div className={style.buttonInner}>
                                <svg width="70" height="70" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_549_1048)">
                                        <path className={style.buttonIcon} d="M62.5003 100H37.5003C26.0128 100 16.667 90.6542 16.667 79.1667V20.8333C16.667 9.34583 26.0128 0 37.5003 0H62.5003C73.9878 0 83.3337 9.34583 83.3337 20.8333V79.1667C83.3337 90.6542 73.9878 100 62.5003 100ZM37.5003 8.33333C30.6087 8.33333 25.0003 13.9417 25.0003 20.8333V79.1667C25.0003 86.0583 30.6087 91.6667 37.5003 91.6667H62.5003C69.392 91.6667 75.0003 86.0583 75.0003 79.1667V20.8333C75.0003 13.9417 69.392 8.33333 62.5003 8.33333H37.5003ZM58.3337 79.1667C58.3337 76.8667 56.467 75 54.167 75H45.8337C43.5337 75 41.667 76.8667 41.667 79.1667C41.667 81.4667 43.5337 83.3333 45.8337 83.3333H54.167C56.467 83.3333 58.3337 81.4667 58.3337 79.1667Z" fill="#5B5B5B" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_549_1048">
                                            <rect width="100" height="100" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                                <p className={style.buttonName}>Phone</p>
                            </div>
                        </button>
                    </div>
                </div>
                <div className={`row justify-content-end g-4 ${style.buttonRow}`}>
                    <div className='col col-lg-3'>
                        <button type="button" onClick={handleHomePage} className={isAllDevicesSelected ? `${style.saveButton} ${style.active}` : style.saveButton}>Save</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ChooseDevicePage;
