/* eslint-disable react/prop-types */
import { Col, Form, Input, Modal, Row, Tabs, message, Checkbox } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux"
import { SetLoader } from "../../../redux/loaderSlice"
import { AddProduct } from "../../../apicalls/product";

const additionalThings = [
  {
    label: "Bill Available",
    name: "billAvailable",
  },
  {
    label: "Warranty Available",
    name: "warrantyAvailable",
  },
  {
    label: "Accessories Available",
    name: "accessoriesAvailable",
  },
  {
    label: "Box Available",
    name: "boxAvailable",
  },
];

const rules = [{ required: true, message: "required" }];

const ProductForm = ({ showProductForm, setShowProductForm }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const formRef = useRef(null);
  const onFinish = async (values) => {
    try {
      values.seller = user._id;
      values.status = "pending";
      dispatch(SetLoader(true))
      const response = await AddProduct(values);
      dispatch(SetLoader(false))
      if (response.success) {
        message.success(response.message)
        setShowProductForm(false)
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false))
      message.error(error.message);
    }
  };
  return (
    <Modal
      title=""
      open={showProductForm}
      onCancel={() => setShowProductForm(false)}
      centered
      width={1000}
      okText="Save"
      onOk={() => formRef.current.submit()}
    >
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="General" key="1">
          <Form layout="vertical" ref={formRef} onFinish={onFinish}>
            <Form.Item label="Name" name="name" rules={rules}>
              <Input type="text" />
            </Form.Item>
            <Form.Item label="Description" name="description" rules={rules}>
              <TextArea type="text" />
            </Form.Item>
            <Row gutter={(16, 16)}>
              <Col span={8}>
                <Form.Item label="Price" name="price" rules={rules}>
                  <Input type="number" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Age" name="age" rules={rules}>
                  <Input type="number" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Category" name="category" rules={rules}>
                  <select>
                    <option value="">Select</option>
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="home">Home</option>
                    <option value="sports">Sports</option>
                    <option value="toys">Toys</option>
                  </select>
                </Form.Item>
              </Col>
            </Row>
            <div className="flex gap-10">
              {additionalThings.map((item) => {
                return (
                  <Form.Item
                    key={item.name}
                    // label={item.label}
                    name={item.name}
                    valuePropName="checked"
                  >
                    <Checkbox>{item.label}</Checkbox>
                  </Form.Item>
                );
              })}
            </div>

          </Form>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Images" key="2">
          <h1>Images</h1>
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
};

export default ProductForm;
