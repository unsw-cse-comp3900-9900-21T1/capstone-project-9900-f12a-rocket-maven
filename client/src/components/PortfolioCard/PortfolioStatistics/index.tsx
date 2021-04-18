import { RealisedValue, UnrealisedValue } from '@rocketmaven/components/TableTooltips'
import { Row } from '@rocketmaven/componentsStyled/Grid'
import { PortfolioInfo } from '@rocketmaven/pages/Portfolio/types'
import { Statistic } from 'antd'
import { getColorOfValue } from '../helper'

type Props = {
  portfolio: PortfolioInfo
  currencyPrefix: string
}

const PortfolioStatistics = ({ portfolio, currencyPrefix }: Props) => {
  const value = [
    ['Current Market', [false, portfolio.current_value_sum]],
    ['Purchase Cost', [false, portfolio.purchase_value_sum]],
    [
      UnrealisedValue,
      [true, (portfolio.current_value_sum - portfolio.purchase_value_sum).toFixed(2)]
    ],
    [RealisedValue, [true, portfolio.realised_sum]]
  ]

  return (
    <Row>
      {value.map(e => {
        return (
          <Statistic
            title={e[0]}
            value={(e[1] as [boolean, number])[1]}
            precision={2}
            valueStyle={{
              color: (e[1] as [boolean, number])[0]
                ? getColorOfValue((e[1] as [boolean, number])[1])
                : 'initial'
            }}
            prefix={currencyPrefix}
          />
        )
      })}
    </Row>
  )
}

export default PortfolioStatistics