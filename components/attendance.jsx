"use client";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Button, Checkbox } from "@mui/material";
import axios from "axios";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { InputLabel, Select, MenuItem, Box } from "@mui/material";
import { useEffect, useState } from "react";

export default function Attendance() {
  const columns = [
    {
      field: "studentname",
      headerName: "Name",
      type: "string",
      width: 120,
      editable: false,
    },
    {
      field: "EnRoll",
      headerName: "EnRoll",
      width: 110,
      type: "string",
      editable: false,
    },
    {
      field: "isPresent",
      headerName: "Present",
      renderCell: (params) => {
        return (
          <Checkbox
            checked={params.value ? true : false}
            onChange={handleChange(params.id)}
          />
        );
      },
      width: 140,
      editable: true,
    },
  ];

  function handleChange(id) {
    return (event) => {
      const newRows = rows.map((row) => {
        if (row.id === id) {
          return { ...row, isPresent: event.target.checked };
        }
        return row;
      });
      setRows(newRows);
    };
  }

  const [rows, setRows] = useState([]);
  const [date, setDate] = useState(dayjs());
  const [division, setDivision] = useState("H3");
  const [record, setRecord] = useState([]);
  const [isInsert, setInsert] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("http://localhost:4000/show", {
          date: date.format("YYYY-MM-DD"),
          division: division,
        });
        if (response.data.length === 0) {
          const studData = await axios.post("http://localhost:4000/stud", {
            division: division,
          });
          const newRows = studData.data.user.map((value, index) => ({
            id: index,
            studentname: value.Name,
            EnRoll: value.EnRoll,
            isPresent: false,
          }));
          setRows(newRows);
        } else {
          const newRows = response.data.map((value, ind) => ({
            id: ind,
            studentname: value.studentname,
            EnRoll: value.enroll,
            isPresent: value.isPresent,
          }));
          console.log(newRows);
          setRows(newRows);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [date, division]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("http://localhost:4000/load");
        setRecord(response.data.user);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (isInsert) {
      try {
        await axios.post("http://localhost:4000/insert", {
          updatedRows: rows,
          date: date.format("YYYY-MM-DD"),
          div: division,
        });
        console.log("Data inserted successfully");
      } catch (error) {
        console.error("Error updating data:", error);
      }
    } else {
      try {
        await axios.post("http://localhost:4000/update", {
          updatedRows: rows,
          date: date.format("YYYY-MM-DD"),
          div: division,
        });
        console.log("Data updated successfully");
      } catch (error) {
        console.error("Error updating data:", error);
      }
    }
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", gap: "20px", margin: "20px 0" }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              label="Pick Date"
              value={date}
              onChange={(newDate) => {
                setDate(newDate);
              }}
            />
          </DemoContainer>
        </LocalizationProvider>

        <Box
          sx={{
            minWidth: 120,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <InputLabel id="division-select-label">Division</InputLabel>
          <Select
            labelId="division-select-label"
            id="division-select"
            value={division}
            label="Division"
            onChange={(e) => {
              setDivision(e.target.value);
            }}
          >
            <MenuItem value={"G3"}>G3</MenuItem>
            <MenuItem value={"H3"}>H3</MenuItem>
            <MenuItem value={"N3"}>N3</MenuItem>
          </Select>
        </Box>
      </div>

      <Box sx={{ height: "60dvh", width: "90%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          autoPageSize={true}
          pageSizeOptions={[5, 10, 15, 20, 25]}
          slots={{
            toolbar: GridToolbar,
          }}
          disableRowSelectionOnClick
          disableColumnResize
        />
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ mt: 2 }}
      >
        {isInsert ? "Insert" : "Submit"}
      </Button>
    </div>
  );
}
