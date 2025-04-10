"use client";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Button, Checkbox, useMediaQuery, useTheme } from "@mui/material";
import axios from "axios";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { InputLabel, Select, MenuItem, Box } from "@mui/material";
import { useEffect, useState } from "react";

export default function Attendance() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const columns = [
    {
      field: "studentname",
      headerName: "Name",
      type: "string",
      width: isMobile ? 122 : 130,
      editable: false,
    },
    {
      field: "EnRoll",
      headerName: "EnRoll",
      width: isMobile ? 118 : 122,
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
      width: isMobile ? 123 : 130,
      editable: true,
    },
  ];

  function handleChange(id) {
    return (event) => {
      setRows((prevRows) => {
        const newRows = prevRows.map((row) =>
          row.id === id ? { ...row, ispresent: event.target.checked } : row
        );

        setChangedRows((prev) => {
          const updatedRow = newRows.find((row) => row.id === id);
          const existingIndex = prev.findIndex((row) => row.id === id);

          if (existingIndex >= 0) {
            const newChangedRows = [...prev];
            newChangedRows[existingIndex] = updatedRow;
            return newChangedRows;
          } else {
            return [...prev, updatedRow];
          }
        });

        return newRows;
      });
    };
  }

  const [rows, setRows] = useState([]);
  const [changedRows, setChangedRows] = useState([]);
  const [date, setDate] = useState(dayjs());
  const [division, setDivision] = useState("H3");
  const [isInsert, setInsert] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("/api/attendance/show", {
          date: date.format("YYYY-MM-DD"),
          division: division,
        });
        if (response.data.length === 0) {
          setInsert(true);
          const studData = await axios.post("/api/attendance/stud", {
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
          setInsert(false);
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

  const handleSubmit = async () => {
    if (isInsert) {
      try {
        await axios.post("/api/attendance/insert", {
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
        await axios.post("/api/attendance/update", {
          updatedRows: changedRows,
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
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: isMobile ? 1 : 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 2 : 4,
          alignItems: "center",
          width: "100%",
          maxWidth: "800px",
          mb: 3,
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              label="Pick Date"
              value={date}
              onChange={(newDate) => setDate(newDate)}
              sx={{ width: isMobile ? "100%" : "auto" }}
            />
          </DemoContainer>
        </LocalizationProvider>

        <Box
          sx={{
            minWidth: 120,
            width: isMobile ? "30%" : "auto",
          }}
        >
          <InputLabel id="division-select-label">Division</InputLabel>
          <Select
            labelId="division-select-label"
            id="division-select"
            value={division}
            label="Division"
            onChange={(e) => setDivision(e.target.value)}
            fullWidth={isMobile}
          >
            <MenuItem value={"G3"}>G3</MenuItem>
            <MenuItem value={"H3"}>H3</MenuItem>
            <MenuItem value={"N3"}>N3</MenuItem>
          </Select>
        </Box>
      </Box>

      <Box
        sx={{
          height: "60dvh",
          width: "100%",
          maxWidth: "1200px",
          mb: 3,
        }}
      >
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
        sx={{
          mt: 2,
          width: isMobile ? "90%" : "auto",
        }}
      >
        {isInsert ? "Insert" : "Submit"}
      </Button>
    </Box>
  );
}
