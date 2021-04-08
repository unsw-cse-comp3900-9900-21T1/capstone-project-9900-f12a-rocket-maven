import { Form, Button } from 'antd'
import { Card } from '@rocketmaven/componentsStyled/Card'
import { urls } from '@rocketmaven/data/urls'
import { useState } from 'react'
import { useHistory } from 'react-router'
import {
  useAccessToken,
  useFetchMutationWithUserId
} from '@rocketmaven/hooks/http'

import { Upload, message } from 'antd'

import { LoadingOutlined, PlusOutlined, InboxOutlined } from '@ant-design/icons'

type Props = {
  portfolioId?: string
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 10 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
}

const PortfolioAssetEditForm = ({ portfolioId }: Props) => {
  const [fileList, setFileList] = useState<any[]>([])
  const [form] = Form.useForm()
  const routerObject = useHistory()
  const { accessToken, revalidateAccessToken } = useAccessToken()

  const urlEnd = `/api/v1/portfolios/${portfolioId}/history`

  const setValuesAndFetch: Function = useFetchMutationWithUserId(urlEnd, 'POST', urls.portfolio)

  const onFinish = async (values: any) => {
    const formData = new FormData()
    fileList.forEach((file) => {
      formData.append('files[]', file)
    })

    const response = await fetch(urlEnd, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      body: formData
    })
    const data = await response.json()
    if (!response.ok) {
      message.error(`${data.msg}`)
      return
    }
    routerObject.push('/')

    console.log('************** values are ', values)
    setValuesAndFetch({
      ...values
    })
  }

  const uploadButton = (
    <div>
      {false ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Drop CSV File Here</div>
    </div>
  )

  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      /* this.setState({ loading: true }); */
      return
    }
    if (info.file.status === 'done') {
    }
  }

  const beforeUpload = function (file: any) {
    setFileList([...fileList, file])
    return false
  }

  const onRemove = function (file: any) {
    const index = fileList.indexOf(file)
    const newFileList = fileList.slice()
    newFileList.splice(index, 1)
    setFileList(newFileList)
  }

  return (
    <Card>
      <Form
        style={{ textAlign: 'center' }}
        name="csv_upload"
        className="csv-upload-form"
        form={form}
        {...formItemLayout}
        onFinish={onFinish}
      >
        <Form.Item name="dragger" className="csv-uploader" noStyle>
          <Upload.Dragger
            name="files"
            beforeUpload={beforeUpload}
            onChange={handleChange}
            onRemove={onRemove}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag CSV file to this area to bulk import</p>
            <p className="ant-upload-hint">Support for mulitple files.</p>
          </Upload.Dragger>
        </Form.Item>

        {/* <Button type="primary" onClick={() => setAddActionValue(true)} htmlType="submit" value={addActionValue} style={{ */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{
              marginRight: '8px',
              marginBottom: '12px'
            }}
          >
            Upload
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default PortfolioAssetEditForm
