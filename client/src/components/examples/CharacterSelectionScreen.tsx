import CharacterSelectionScreen from '../CharacterSelectionScreen'

export default function CharacterSelectionScreenExample() {
  return (
    <CharacterSelectionScreen 
      onCharacterSelect={(character) => console.log('Character selected:', character.name)} 
    />
  )
}