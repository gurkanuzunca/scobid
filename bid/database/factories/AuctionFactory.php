<?php

namespace Database\Factories;

use App\Models\Auction;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class AuctionFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Auction::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $openPrice = $this->faker->numberBetween(10, 1000);

        return [
            'title' => $this->faker->company,
            'description' => $this->faker->text,
            'open_price' => $openPrice,
            'last_price' => $openPrice,
            'image' => sprintf('%s.jpg', $this->faker->numberBetween(1,5)),
            'closed_at' => $this->faker->dateTimeBetween('+5 days','+1 month'),
        ];
    }
}
