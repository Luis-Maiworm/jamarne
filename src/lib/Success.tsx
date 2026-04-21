import { Button } from '@/components/ui/8bit/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/8bit/card'
import { Badge } from '@/components/ui/8bit/badge'
import st01 from '@/assets/gif/st_01.gif'
import st02 from '@/assets/gif/st_02.gif'
import st03 from '@/assets/gif/st_03.gif'
import st04 from '@/assets/gif/st_04.gif'
import st05 from '@/assets/gif/st_05.gif'
import st06 from '@/assets/gif/st_06.gif'
import st07 from '@/assets/gif/st_07.gif'
import st08 from '@/assets/gif/st_08.gif'
import st09 from '@/assets/gif/st_09.gif'
import st10 from '@/assets/gif/st_10.gif'
import st11 from '@/assets/gif/st_11.gif'
import st12 from '@/assets/gif/st_12.gif'
import st13 from '@/assets/gif/st_13.gif'
import st14 from '@/assets/gif/st_14.gif'
import st15 from '@/assets/gif/st_15.gif'
import st16 from '@/assets/gif/st_16.gif'
import st17 from '@/assets/gif/st_17.gif'
import st18 from '@/assets/gif/st_18.gif'
import st19 from '@/assets/gif/st_19.gif'
import st20 from '@/assets/gif/st_20.gif'
import st21 from '@/assets/gif/st_21.gif'
import st22 from '@/assets/gif/st_22.gif'
import st23 from '@/assets/gif/st_23.gif'
import st24 from '@/assets/gif/st_24.gif'
import st25 from '@/assets/gif/st_25.gif'
import st26 from '@/assets/gif/st_26.gif'
import stTitle2 from '@/assets/gif/st_title2.gif'

const GIF_POOL = [
	st01,
	st02,
	st03,
	st04,
	st05,
	st06,
	st07,
	st08,
	st09,
	st10,
	st11,
	st12,
	st13,
	st14,
	st15,
	st16,
	st17,
	st18,
	st19,
	st20,
	st21,
	st22,
	st23,
	st24,
	st25,
	st26,
]

type GifTile = {
	key: string
	src: string
	row: number
	col: number
}

const GRID_COLUMNS = 14
const GRID_ROWS = 8

const TILES: GifTile[] = (() => {
	const tiles: GifTile[] = []
	let pointer = 0

	for (let row = 0; row < GRID_ROWS; row += 1) {
		for (let col = 0; col < GRID_COLUMNS; col += 1) {
			tiles.push({
				key: `${row}-${col}`,
				src: GIF_POOL[pointer % GIF_POOL.length],
				row,
				col,
			})
			pointer += 1
		}
	}

	return tiles
})()

interface SuccessPageProps {
	onReset?: () => void
}

export function SuccessPage({ onReset }: SuccessPageProps) {
	return (
		<section className="result-page" aria-live="polite">
			<div className="result-tile-layer" aria-hidden="true">
				{TILES.map((tile) => (
					<img
						key={tile.key}
						src={tile.src}
						alt=""
						className="result-tile-gif"
						style={{
							gridRowStart: tile.row + 1,
							gridColumnStart: tile.col + 1,
						}}
					/>
				))}
			</div>

			<Card
				className="result-center"

			>
				<CardHeader className="result-header">
					<Badge className="result-kicker">Mission Complete</Badge>
					<CardTitle className="result-title">Access Granted</CardTitle>
					<CardDescription className="result-copy">
						Der Code war korrekt. Willkommen auf Seite 2.
					</CardDescription>
				</CardHeader>
				{onReset && (
					<CardContent className="result-actions">
						<Button onClick={onReset} className="result-button" type="button">
							Zurueck
						</Button>
					</CardContent>
				)}
			</Card>
		</section>
	)
}
