import { Subtitle, Text } from '../../../componentsStyled/Typography'
// import DummyAssetCard from '../DummyAssetCard'

type Props = {
  // Note(Jude): Should not be leaving as any, just aiming to get some CRUD routing pattern implemented
  portfolio: any
}

export const DummyPortfolioCard = ({portfolio}: Props) => {
  // Double rendering happening for some reason and null params are put in; this seems like a quick fix
  if (!portfolio) {
    return null
  }
  return (
    <div>
      <Subtitle>
        {portfolio.name}
      </Subtitle>
      {/* {portfolio.assets.map((asset: any) => <DummyAssetCard asset={asset}/>)} */}
    </div>
  )
}

export default DummyPortfolioCard