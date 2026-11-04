import { CCard, CCardBody } from '@coreui/react'
import React from 'react'
import styles from './dashboard.module.css'
import api from 'src/utils/api'
import { toast } from 'react-toastify'
import { useState, useEffect } from 'react'
import { Bar, Pie, Doughnut, Line } from "react-chartjs-2";
import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   Tooltip,
   Legend,
   ArcElement, PointElement,
   LineElement,
} from "chart.js";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, PointElement,
   LineElement, Title, Tooltip, Legend);


function Dashboard({ show }) {


   console.log(show, 'showAll')
   const [data, setData] = useState({})
   const [userData, setUserData] = useState([])
   const [monthlyData, setMonthlyData] = useState([])


   console.log(data, 'getDashboardData')

   useEffect(() => {
      getData()
      getMonthlyData()
      getUserData()
   }, [])

   function getData(params) {
      api.get('getDashboardData')
         .then((res) => {
            setData(res?.data)
         })
         .catch((err) => {
            toast.error(err?.message)
         })
   }
   function getUserData() {
      api.get('getUserData')
         .then((res) => {
            setUserData(res?.data)
            console.log("userData api", res)
            console.log("userData state", userData)
         })
         .catch((err) => {
            toast.error(err?.message)
         })
   }
   function getMonthlyData() {
      api.get('getMonthlyBookings' )
         .then((res) => {
            setMonthlyData(res?.data)
            console.log("getMonthlyBookings api", res)
            console.log("getMonthlyBookings state", monthlyData)
         })
         .catch((err) => {
            toast.error(err?.message)
         })
   }

   const chartData = {
      labels: [
         "Users",
         "Providers",
         "Subscribed Prv",
         "Actve Provdrs",
         "Staff",
         // "Revenue",
         // "Rtings",
         "Cmplt Bkings",
         "Ongng Bkings",
         "Cncld Bkings",
      ],
      datasets: [
         {
            label: "Dashboard Data",
            data: [
               data.totalUser || 0,
               data.totalProvider || 0,
               data.subsCribedProvider || 0,
               data.activeServiceProvider || 0,
               data.totalStaff || 0,
               // data.totalRevenue ? parseFloat(data.totalRevenue) : 0,
               // data.totalRating || 0,
               data.completedOrder || 0,
               data.onGoingOrder || 0,
               data.cancelledOrder || 0,
            ],
            backgroundColor: "#006D5B",
         },
      ],
   };
   const userChartData = {
      labels: ["Active Users", "Deleted Users"], // Assuming each user object has a 'name' property
      datasets: [
         {
            label: "User Data",
            data: [data.totalUser || 0, data.deletedUsersCount || 0], // Replace 'value' with the actual property you want to chart
            backgroundColor: ["#006D5B", "#d9534f"],
         },
      ],
   };
   const options = {
      responsive: true,
      maintainAspectRatio: true,
      // plugins: {
      //    legend: { display: false }, // hide legend if not needed
      // },
      plugins: {
         legend: {
            position: "bottom", // "top", "left", "right"
            labels: {
               generateLabels: (chart) => {
                  const dataset = chart.data.datasets[0];
                  return chart.data.labels.map((label, i) => {
                     return {
                        text: `${label}: ${dataset.data[i]}`, // 👈 label + value
                        fillStyle: dataset.backgroundColor[i],
                     };
                  });
               },
            },
         },
         tooltip: {
            callbacks: {
               // label: (context) => `${context.label}: ${context.raw}`,
               label: (context) => {
                  let label = context.label || "";
                  let value = context.raw || 0;
                  return `${label}: ${value}`; // 👈 Same line label
               },
            },
         },
      },
      // scales: {
      //    x: {
      //       barThickness: 1,     // fixed bar size
      //       maxBarThickness: 2,  // prevent too wide bars
      //    },
      //    y: {
      //       beginAtZero: true,
      //       ticks: { stepSize: 50 }, // adjust increments
      //    },
      // },
   };

   const staffChartData = {
      labels: ["Active Providers", "Deleted Providers"], // Assuming each user object has a 'name' property
      datasets: [
         {
            label: "User Data",
            data: [data.totalProvider || 0, data.deletedStaffCount || 0], // Replace 'value' with the actual property you want to chart
            backgroundColor: ["#006D5B", "#033639"],
         },
      ],
   };




   return (
      <>
         {/* //Old design// */}
         < div >
            <div className="bdc-container">
               <h1 className="bdc-item">Dashboard</h1>
            </div>
            <div className="flex card p-2 justify-center items-center w-full mb-4" >
               <div className="  w-full max-w-3xl">
                  <Bar
                     data={chartData}
                     options={{
                        responsive: true,
                        maintainAspectRatio: false,
                     }}
                     height={300} // controls vertical height
                  />
               </div>
            </div>
            <div className={`${styles.chartRow} mb-4`}>
               <div className={`${styles.chartCard} card justify-content-center align-items-center`}>
                  <Pie
                     data={userChartData}
                     options={options}
                  />
               </div>
               <div className={`${styles.chartCard} card justify-content-center align-items-center`}>
                  <Doughnut
                     data={staffChartData}
                     options={options}
                  />
               </div>
               <div className={`${styles.chartCard} ${styles.chartCardWide} card justify-content-center align-items-center`}>
                  <Bar
                     data={userChartData}
                     options={options}
                  />
               </div>
            </div>
            <div className={styles.container}>
               <CCard className={styles.cardContent}>
                  <CCardBody>
                     <h5>Total Number of Users</h5>
                     <h4>{data?.totalUser}</h4>
                  </CCardBody>
               </CCard>
               <CCard className={styles.cardContent}>
                  <CCardBody>
                     <h5>Total Service Providers</h5>
                     <h4>{data?.totalProvider}</h4>
                  </CCardBody>
               </CCard>
               <CCard className={styles.cardContent}>
                  <CCardBody>
                     <h5>Total Number of Service Man</h5>
                     <h4>{data?.totalStaff}</h4>
                  </CCardBody>
               </CCard>
               <CCard className={styles.cardContent}>
                  <CCardBody>
                     <h5>Total No. of Completed Orders</h5>
                     <h4>{data?.completedOrder}</h4>
                  </CCardBody>
               </CCard>
               <CCard className={styles.cardContent}>
                  <CCardBody>
                     <h5>Total Ongoing Bookings</h5>
                     <h4>{data?.onGoingOrder}</h4>
                  </CCardBody>
               </CCard>
               <CCard className={styles.cardContent}>
                  <CCardBody>
                     <h5>Total Cancelled Bookings</h5>
                     <h4>{data?.cancelledOrder}</h4>
                  </CCardBody>
               </CCard>
               <CCard className={styles.cardContent}>
                  <CCardBody>
                     <h5>Active Plan Users</h5>
                     <h4>{data?.subsCribedProvider}</h4>
                  </CCardBody>
               </CCard>
               <CCard className={styles.cardContent}>
                  <CCardBody>
                     <h5>Total Active Service Provider</h5>
                     <h4>{data?.activeServiceProvider}</h4>
                  </CCardBody>
               </CCard>
               <CCard className={styles.cardContent}>
                  <CCardBody>
                     <h5>Total Rating and Review</h5>
                     {/* <h4>{data?.ratingData?.length}</h4> */}
                     <h4>{data?.totalRating}</h4>

                  </CCardBody>
               </CCard>
            </div>
         </div >
      </>
   )
}

export default Dashboard;
