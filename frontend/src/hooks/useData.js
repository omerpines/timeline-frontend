import { useSelector } from "react-redux";
import { getData } from "store/selectors/data";

const 
useData = () => {
  return useSelector(getData);
};

export default useData;
