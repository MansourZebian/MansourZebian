import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const TrackingLink = () => {
  const [newScriptData, setNewScriptData] = useState([]);
  const { id } = useParams();
  const userId = localStorage.getItem("userIdd");

  console.log("userId and id", userId, id);

  const getNewScript = async () => {
    await axios
      .get(
        `https://backend.riverketaminestudy.com/api/prescription/get/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        setNewScriptData(response.data);
        console.log("newScript", response.data);
        // setStatus(response.data.status);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getNewScript();
  }, []);

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear() % 100; // Get the last two digits of the year

    return `${day}/${month}/${year}`;
  }

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-left"></h1>
        <div className="mt-10 relative overflow-x-auto">
          <div class="rounded-t-xl rounded-b-xl overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="h-20 text-lg text-black bg-[#f0f1fa] ">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Drug
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Dispense
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Dosage
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Tracking Id
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {newScriptData?.map((item) => {
                  if (item?.tracking_id != id) return;
                  return (
                    // console.log()
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <th
                        scope="row"
                        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {formatDate(item.createdAt)}
                      </th>

                      <td className="px-6 py-4">{item?.drug}</td>
                      <td className="px-6 py-4">{item?.dispense}</td>
                      <td className="px-6 py-4">{item?.dosage}</td>
                      <td
                        className="px-6 py-4"
                        style={{ width: 200, cursor: "copy" }}
                      >
                        {item?.tracking_id}
                      </td>
                      <td className="px-6 py-4" style={{}}>
                        {item?.note}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingLink;
