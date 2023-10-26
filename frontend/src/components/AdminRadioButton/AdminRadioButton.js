import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import AdminInput from 'components/AdminInput';
import './style.css';


const AdminRadioButton = ({value, options, onChange, name, className, label, noTranslation}) => {
const { t } = useTranslation();
const [innerValue, setInnerVaule] = useState(value) 
useEffect(() => {
    if (value === 1)
        setInnerVaule(1);
    else    
        setInnerVaule(0);

},[value]);

console.log('=================value', value)
const onChooseOption = useCallback((radiovalue) => {
    if(radiovalue === 'show'){
        setInnerVaule(1);
        onChange(name, 1);
    }
    else if(radiovalue === 'hide'){
        setInnerVaule(0);
        onChange(name, 0);
    }
  }, [onChange, name, innerValue]);

  return (
    <AdminInput wrapOnly label={label} className={className}>
        <div className="admin-radiobutton">
            <div className='radio-container'>
                <label className='radio-text'>{noTranslation ? value : t(options[0])}<input type="radio" name="timeline"  value='show' className='raddio-button' onChange={(e) =>onChooseOption(e.target.value)} checked={innerValue===1}/></label>
            </div>
            <div className='radio-container'>
                <label className='radio-text'>{noTranslation ? value : t(options[1])}<input type="radio" name="timeline"  value='hide' className='raddio-button' onChange={(e) =>onChooseOption(e.target.value)} checked={innerValue===0}/></label>
            </div>
        </div> 
    </AdminInput>
  );
};

export default AdminRadioButton;
