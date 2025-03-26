import Swal from "sweetalert2";

const confirmDialog = async (title = "Are you sure?", text = "", icon = "warning") => {
  return Swal.fire({
    title: title,
    text: text,
    icon: icon,
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, confirm!",
  });
};

export default confirmDialog;
