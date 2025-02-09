export default function defineAgentCreationMessage(postsCount: number): string {
  if (postsCount < 10) {
    return 'Do you even trench BRO?'
  } else if (postsCount < 50) {
    return "You're exploring the trenches, but there's much more to discover."
  } else if (postsCount < 100) {
    return "You're a trench warrior, making your mark on the Algorand community."
  } else if (postsCount < 500) {
    return "Trench Oracle, you're a true inspiration in the trenches!"
  } else if (postsCount < 1000) {
    return 'Trench Legend, your name echoes through the halls of the Algorand trenches!'
  } else {
    return 'Trench Immortal, your wisdom and legacy will guide future generations!'
  }
}
