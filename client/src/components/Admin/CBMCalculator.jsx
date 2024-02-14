import React, { useState } from 'react';
import { Form, Input, Button, Select, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Text } = Typography;

const CBMCalculator = () => {
  const [quantity, setQuantity] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("cm");
  const [selectedWeightUnit, setSelectedWeightUnit] = useState("Kg");
  const [result, setResult] = useState("");

  const handleUnitChange = (value) => {
    setSelectedUnit(value);
  };

  const handleWeightUnitChange = (value) => {
    setSelectedWeightUnit(value);
  };

  const handleCalculate = () => {
    let l = parseFloat(length);
    let w = parseFloat(width);
    let h = parseFloat(height);
    let qty = parseFloat(quantity);
    let wt = parseFloat(weight);
  
    if (isNaN(l) || isNaN(w) || isNaN(h) || isNaN(qty) || isNaN(wt) || l <= 0 || w <= 0 || h <= 0) {
      setResult("Error: Dimensions and weight must be positive numbers.");
      return;
    }
  
    if (selectedWeightUnit === "lbs") {
      // Convert weight from lbs to kg
      wt = wt / 2.20462;
    }
  
    if (selectedUnit === "inch") {
      // Convert dimensions to inches
      l = l * 2.54;
      w = w * 2.54;
      h = h * 2.54;
    } else if(selectedUnit === "meter"){
      // Convert dimensions to meter
      l = l * 100;
      w = w * 100;
      h = h * 100;
    }
  
    const cbm = ((l * w * h * qty) / 1000000).toFixed(3);
    const cbmCubicFeet = (cbm * 35.315).toFixed(3); // Convert CBM to cubic feet
    const grossWeightKg = (qty * wt).toFixed(2);
    const grossWeightLbs = (grossWeightKg * 2.20462).toFixed(2);
    const airVolumetricWeightKg = (((w * l * h) / 6000) * qty).toFixed(2);
    const seaVolumetricWeightKg = (((w * l * h) / 5000) * qty).toFixed(2);
    const airVolumetricWeightLbs = ((airVolumetricWeightKg * 2.20462).toFixed(2));
    const seaVolumetricWeightLbs = ((seaVolumetricWeightKg * 2.20462).toFixed(2));
  
    setResult(
      <div>
        <div className="bg-gray-200 p-4 mb-4">
          <Text strong>CBM:</Text> <Text>{cbm} m³ / {cbmCubicFeet} ft³<br /></Text>
        </div>
        <div className="bg-gray-200 p-4 mb-4">
          <Text strong>Weight:</Text> <Text>{grossWeightKg} Kg / {grossWeightLbs} lbs<br /></Text>
        </div>
        <div className="bg-gray-200 p-4 mb-4">
          <Text strong>Volumetric Weight (Air freight):</Text> <Text>{airVolumetricWeightKg} Kg / {airVolumetricWeightLbs} lbs<br /></Text>
        </div>
        <div className="bg-gray-200 p-4">
          <Text strong>Volumetric Weight (Sea freight):</Text> <Text>{seaVolumetricWeightKg} Kg / {seaVolumetricWeightLbs} lbs</Text>
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-center w-full">
      <div className="w-1/2">
        <h1 className="text-lg font-semibold mb-4">CBM Calculator</h1>
        <Form onFinish={handleCalculate}>
          <Form.Item label="# of units" name="quantity">
            <Input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </Form.Item>
          <Form.Item label="Dimensions (L x W x H per unit)">
            <Input.Group compact>
              <Input style={{ width: '25%' }} placeholder="Length" value={length} onChange={(e) => setLength(e.target.value)} />
              <Input style={{ width: '25%' }} placeholder="Width" value={width} onChange={(e) => setWidth(e.target.value)} />
              <Input style={{ width: '25%' }} placeholder="Height" value={height} onChange={(e) => setHeight(e.target.value)} />
              <Select style={{ width: '25%' }} defaultValue={selectedUnit} onChange={handleUnitChange}>
                <Option value="cm">CM</Option>
                <Option value="inch">IN</Option>
                <Option value="meter">M</Option>
              </Select>
            </Input.Group>
          </Form.Item>
          <Form.Item label="Weight (per unit)">
            <Input.Group compact>
              <Input style={{ width: '60%' }} placeholder="Weight" value={weight} onChange={(e) => setWeight(e.target.value)} />
              <Select style={{ width: '40%' }} defaultValue={selectedWeightUnit} onChange={handleWeightUnitChange}>
                <Option value="Kg">KG</Option>
                <Option value="Lbs">LBS</Option>
              </Select>
            </Input.Group>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>Calculate</Button>
          </Form.Item>
        </Form>
        <div className="mt-4">{result}</div>
      </div>
    </div>
  );
}

export default CBMCalculator;
