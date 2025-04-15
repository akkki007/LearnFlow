"use client";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import axios from "axios";
import { InputLabel, Select, MenuItem } from "@mui/material";

export default function Marks() {
  const [rows, setRows] = useState([]);
  const [changedRows, setChangedRows] = useState([]);
  const [division, setDivision] = useState("H3");
  const [subject, setSubject] = useState("Android");

  const calculateTotal = (row) => {
    let total = 0;
    for (let i = 1; i <= 10; i++) {
      total += row[`PR-${i}`] || 0;
    }
    return total;
  };

  const calculate25 = (row) => {
    let total = calculateTotal(row);
    let avg = (total / 100) * 25;
    return Math.round(avg);
  };

  const calculate50 = (row) => {
    let total = calculateTotal(row);
    let avg = (total / 100) * 50;
    return Math.round(avg);
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = {
      ...newRow,
      total: calculateTotal(newRow),
      "Out-of-25": calculate25(newRow),
      "Out-of-50": calculate50(newRow),
    };
    const updatedRows = rows.map((row) =>
      row.id === updatedRow.id ? updatedRow : row
    );
    setChangedRows((prev) => {
      const existingRowIndex = prev.findIndex(
        (row) => row.id === updatedRow.id
      );
      if (existingRowIndex >= 0) {
        const newChangedRows = [...prev];
        newChangedRows[existingRowIndex] = updatedRow;
        return newChangedRows;
      } else {
        return [...prev, updatedRow];
      }
    });
    setRows(updatedRows);
    return updatedRow;
  };

  const columns = [
    {
      field: "studentname",
      headerName: "StudentName",
      type: "string",
      width: 150,
      editable: false,
    },
    {
      field: "enroll",
      headerName: "EnRoll",
      width: 120,
      type: "string",
      editable: false,
    },
    {
      field: "PR-1",
      headerName: "1",
      width: 100,
      editable: true,
      type: "number",
    },
    {
      field: "PR-2",
      headerName: "2",
      width: 100,
      editable: true,
      type: "number",
    },
    {
      field: "PR-3",
      headerName: "3",
      width: 100,
      editable: true,
      type: "number",
    },
    {
      field: "PR-4",
      headerName: "4",
      width: 100,
      editable: true,
      type: "number",
    },
    {
      field: "PR-5",
      headerName: "5",
      width: 100,
      editable: true,
      type: "number",
    },
    {
      field: "PR-6",
      headerName: "6",
      width: 100,
      editable: true,
      type: "number",
    },
    {
      field: "PR-7",
      headerName: "7",
      width: 100,
      editable: true,
      type: "number",
    },
    {
      field: "PR-8",
      headerName: "8",
      width: 100,
      editable: true,
      type: "number",
    },
    {
      field: "PR-9",
      headerName: "9",
      width: 100,
      editable: true,
      type: "number",
    },
    {
      field: "PR-10",
      headerName: "10",
      width: 100,
      editable: true,
      type: "number",
    },
    {
      field: "total",
      headerName: "Total",
      width: 110,
      editable: false,
      type: "number",
    },
    {
      field: "Out-of-25",
      headerName: "=25",
      width: 120,
      editable: false,
      type: "number",
    },
    {
      field: "Out-of-50",
      headerName: "=50",
      width: 100,
      editable: false,
      type: "number",
    },
  ];

  const handleSubmit = async () => {
    try {
      const response = await axios.post("/api/marks/update", {
        division: division,
        subject: subject,
        marks: rows,
      });
      console.log("Marks updated:", response.data);
    } catch (error) {
      console.error("Error updating marks:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("/api/marks", {
          division: division,
          subject: subject,
        });

        if (response.data.message) {
          setRows([]);
        } else {
          response.data.forEach((row, index) => {
            row.id = index + 1; // Assigning a unique ID to each row
          });
          setRows(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [division, subject]);

  return (
    <div className="w-full h-full p-4 flex flex-col items-center">
      <div className="w-full max-w-6xl flex gap-4 mb-4">
        <Box sx={{ minWidth: 120 }}>
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

        <Box sx={{ minWidth: 120 }}>
          <InputLabel id="subject-select-label">Subject</InputLabel>
          <Select
            labelId="subject-select-label"
            id="subject-select"
            value={subject}
            label="Subject"
            onChange={(e) => {
              setSubject(e.target.value);
            }}
          >
            <MenuItem value={"Android"}>Android</MenuItem>
            <MenuItem value={"Python"}>Python</MenuItem>
            <MenuItem value={"Java"}>Java</MenuItem>
          </Select>
        </Box>
      </div>

      <Box sx={{ height: "70vh", width: "100%", maxWidth: "1800px" }}>
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
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={(error) => {
            console.error("Error updating row:", error);
          }}
        />
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ mt: 2 }}
      >
        Update
      </Button>
    </div>
  );
}
