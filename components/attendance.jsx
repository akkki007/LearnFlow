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
      width: isMobile ? 100 : 120, // Adjust width for mobile
      editable: false,
    },
    {
      field: "EnRoll",
      headerName: "EnRoll",
      width: isMobile ? 90 : 110, // Adjust width for mobile
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
      width: isMobile ? 100 : 140, // Adjust width for mobile
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
        const response = await axios.post("/api/attendance/show", {
          date: date.format("YYYY-MM-DD"),
          division: division,
        });
        if (response.data.length === 0) {
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
        const response = await axios.post("/api/attendance/load");
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
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: isMobile ? 1 : 3, // Adjust padding for mobile
      }}
    >
      {/* Date Picker and Division Select */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row", // Stack vertically on mobile
          gap: isMobile ? 2 : 4, // Adjust gap for mobile
          alignItems: "center",
          width: "100%",
          maxWidth: "800px", // Limit width for larger screens
          mb: 3,
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              label="Pick Date"
              value={date}
              onChange={(newDate) => setDate(newDate)}
              sx={{ width: isMobile ? "100%" : "auto" }} // Full width on mobile
            />
          </DemoContainer>
        </LocalizationProvider>

        <Box
          sx={{
            minWidth: 120,
            width: isMobile ? "100%" : "auto", // Full width on mobile
          }}
        >
          <InputLabel id="division-select-label">Division</InputLabel>
          <Select
            labelId="division-select-label"
            id="division-select"
            value={division}
            label="Division"
            onChange={(e) => setDivision(e.target.value)}
            fullWidth={isMobile} // Full width on mobile
          >
            <MenuItem value={"G3"}>G3</MenuItem>
            <MenuItem value={"H3"}>H3</MenuItem>
            <MenuItem value={"N3"}>N3</MenuItem>
          </Select>
        </Box>
      </Box>

      {/* DataGrid */}
      <Box
        sx={{
          height: "60dvh",
          width: "90%",
          maxWidth: "1200px", // Limit width for larger screens
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

      {/* Submit Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{
          mt: 2,
          width: isMobile ? "90%" : "auto", // Full width on mobile
        }}
      >
        {isInsert ? "Insert" : "Submit"}
      </Button>
    </Box>
  );
}