import { useState } from "react";
import Datepicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../App.css";

localStorage.clear();
const ReactTable = () => {
  const loadInitData = () => {
    const savedData = localStorage.getItem("bets");
    return savedData
      ? JSON.parse(savedData)
      : [
          {
            ID: 1,
            bet: "bet you won't",
            startDate: "09/13/2024",
            endDate: "09/13/2024",
            status: "Pending",
          },
        ];
  };

  const [Data, setData] = useState(loadInitData());
  const [page, setPage] = useState(1);

  const handleClick = () => {
    const newBets = [
      ...Data,
      { ID: Data.length + 1, bet: "", startDate: "", endDate: "", status: "" },
    ];
    localStorage.setItem("bets", JSON.stringify(newBets));
    setData(newBets);

    if (Data.length % 20 === 0) {
      handleForward();
    }

    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  };

  const handleDelete = (id: number) => {
    const filteredData = Data.filter((item: any) => item.ID !== id);
    setData(filteredData);
    localStorage.setItem("bets", JSON.stringify(filteredData));
  };

  const handleForward = () => {
    if (Data.length >= page * 20) {
      setPage(page + 1);
    }
  };

  const handleBack = () => {
    if (page >= 2) {
      setPage(page - 1);
    }
  };

  const handleDateChange = (
    date: Date | null | string | undefined,
    id: number,
    type: "startDate" | "endDate" | "status"
  ) => {
    const newDate = Data.map((item: any) =>
      item.ID === id ? { ...item, [type]: date } : item
    );
    setData(newDate);
    localStorage.setItem("bets", JSON.stringify(newDate));
  };

  const statusCount = (status: string) => {
    return Data.filter((item: any) => item.status === status).length;
  }

  return (
    <>
      <h1 className="table-background text-center">Bet Maker</h1>
      <div className="counter-group">
        <div className="counter-won">Won: {statusCount("Won")}</div>
        <div className="counter-lost">Lost: {statusCount("Lost")}</div>
        <div className="counter-pending">Pending: {statusCount("Pending")}</div>
        <div className="counter-progress">In Progress: {statusCount("In Progress")}</div>
      </div>
      <div className="container">
        <table className="table">
          <thead>
            <tr>
              <th>Bet</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {Data.slice(page * 20 - 20, page * 20).map(
              (item: any) => (
                <tr key={item.ID}>
                  <td contentEditable="true">{item.bet}</td>

                  <td>
                    <Datepicker
                      className = "date-picker"
                      selected={item.startDate}
                      onChange={(date: Date | null) =>
                        handleDateChange(date, item.ID, "startDate")
                      }
                    />
                  </td>
                  <td>
                    <Datepicker
                      className = "date-picker"
                      selected={item.endDate}
                      onChange={(date: Date | null) =>
                        handleDateChange(date, item.ID, "endDate")
                      }
                    />
                  </td>


                  <td>
                    <select
                      className="status-select"
                      value={item.status}
                      onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                        handleDateChange(event.target.value, item.ID, "status")
                      }
                    >
                      <option value="" hidden>Status</option>
                      <option value="Won">Won</option>
                      <option value="Lost">Lost</option>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                    </select>
                  </td>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(item.ID)}
                  >
                    X
                  </button>
                </tr>
              )
            )}
          </tbody>
        </table>
        <div className="page-button-group">
          <button className="page-button" onClick={handleBack}>
            &lt;
          </button>
          <button className="add-button" onClick={handleClick}>
          New Bet
          </button>
          <button className="page-button" onClick={handleForward}>
            &gt;
          </button>
        </div>

      </div>
    </>
  );
};

export default ReactTable;
